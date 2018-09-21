import { parse } from 'graphql';
import React from 'react';
import PropTypes from 'prop-types';
import QueryStore from '../utility/QueryStore';
import HistoryQuery from './HistoryQuery';

const shouldSaveQuery = (nextProps, currentProps, allHistoryQueries) => {
  if (nextProps.queryID === currentProps.queryID) {
    return false;
  }
  try {
    parse(nextProps.query);
  } catch (e) {
    return false;
  }

  // change the value of execute if a duplicate is found below
  let execute = true;

  // iterate through all existing history queries and ensure no duplicates are created.
  allHistoryQueries.forEach(entry => {
    if (JSON.stringify(nextProps.operationName) === JSON.stringify(entry.operationName)) {
      if (JSON.stringify(nextProps.query) === JSON.stringify(entry.query)) {
        if (JSON.stringify(nextProps.variables) === JSON.stringify(entry.variables)) {
          execute = false;
        }
        if (!nextProps.variables && !entry.variables) {
          execute = false;
        }
        execute = false;
      }
    }
  });
  return execute;
};

const MAX_HISTORY_LENGTH = 20;

export class QueryHistory extends React.Component {
  static propTypes = {
    response: PropTypes.string,
    query: PropTypes.string,
    variables: PropTypes.string,
    operationName: PropTypes.string,
    queryID: PropTypes.number,
    onSelectQuery: PropTypes.func,
    storage: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.historyStore = new QueryStore('queries', props.storage);
    this.selectedForTestingStore = new QueryStore('testing', props.storage);
    const historyQueries = this.historyStore.fetchAll();
    this.state = { historyQueries };
  }

  componentWillReceiveProps(nextProps) {
    // ensure no duplicates will be created, pass all existing queries into shouldSaveQuery
    const allHistoryQueries = this.historyStore.fetchAll() || [];
    if (shouldSaveQuery(nextProps, this.props, allHistoryQueries)) {
      const item = {
        query: nextProps.query,
        variables: nextProps.variables,
        operationName: nextProps.operationName,
        response: nextProps.response
      };
      this.historyStore.push(item);

      // -------  Jon 9/19/18 -----------
      // revisit this section, if user favorites a query and the query is at the beginning of the array
      // it will get removed
      if (this.historyStore.length > MAX_HISTORY_LENGTH) {
        this.historyStore.shift();
      }
      // ------------------------------------
      const newListOfHistoryQueries = this.historyStore.items;
      this.setState({
        historyQueries: newListOfHistoryQueries
      });
    }
  }

  render() {
    const downloadButton = {
      display: this.selectedForTestingStore.items.length === 0 ? 'none' : '',
      marginLeft: '10px'
    };
    const queryNodes = this.createQueryNodes(this.state.historyQueries);
    return (
      <div>
        <div className="history-title-bar">
          <div className="history-title">{'Test Drawer'}</div>
          <div className="doc-explorer-rhs">{this.props.children}</div>
        </div>
        <div className="history-contents">
          {queryNodes}
          <div>
            <button
              className="download-tests-button"
              onClick={this._downloadTestFile}
              style={downloadButton}>
              Download Tests
            </button>
            <button className="delete-query-history-button" onClick={this._deleteQueryHistory}>
              Delete Query History
            </button>
          </div>
        </div>
      </div>
    );
  }

  createQueryNodes = queryStore => {
    const nodes = queryStore.slice().reverse();
    return nodes.map((node, i) => {
      return (
        <HistoryQuery
          response={this.props.response}
          handleEditLabel={this.editLabel}
          handleToggleFavorite={this.toggleFavorite}
          handleDeleteItem={this.deleteItem}
          key={i}
          onSelect={this.props.onSelectQuery}
          {...node}
        />
      );
    });
  };

  deleteItem = (query, variables, operationName, favorite, response) => {
    const item = {
      query,
      variables,
      operationName,
      response
    };
    if (this.historyStore.contains(item)) {
      this.historyStore.delete(item);
    }
    if (this.selectedForTestingStore.contains(item)) {
      this.selectedForTestingStore.delete(item);
    }
    const historyQueries = this.historyStore.items;
    this.setState({ historyQueries });
  };

  _deleteQueryHistory = () => {
    this.historyStore.items = [];
    this.selectedForTestingStore.items = [];

    console.log('historyStore', this.historyStore);
    console.log('historyStore.items', this.historyStore.items);
    console.log('selectedForTestingStore', this.selectedForTestingStore);
    console.log('selectedForTestingStore.item', this.selectedForTestingStore.items);

    const historyQueries = this.historyStore.items;
    this.setState({ historyQueries });
  };

  toggleFavorite = (query, variables, operationName, favorite, response) => {
    const item = {
      query,
      variables,
      operationName,
      response
    };

    // if the item does not exist in the selectedForTestingStore, create a property favorite on the item and set it to true. Add the item to the store and edit the same item in the historyStore.
    if (!this.selectedForTestingStore.contains(item)) {
      item.favorite = true;
      this.selectedForTestingStore.push(item);
      this.historyStore.edit(item);
    } else if (favorite) {
      item.favorite = false;
      this.historyStore.edit(item);
      this.selectedForTestingStore.delete(item);
    }

    // set state with the changed queries
    const historyQueries = this.historyStore.items;
    this.setState({ historyQueries });
  };

  // Jon: Label functionality not needed, will discuss with team before removal - 9/17/18
  editLabel = (query, variables, operationName, label, favorite) => {
    const item = {
      query,
      variables,
      operationName,
      label
    };
    if (favorite) {
      this.favoriteStore.edit({ ...item, favorite });
    } else {
      this.historyStore.edit(item);
    }
    this.setState({ ...this.historyStore.items, ...this.favoriteStore.items });
  };

  _downloadTestFile = () => {
    console.log('historyStore', this.historyStore);
    console.log('historyStore.items', this.historyStore.items);
    console.log('selectedForTestingStore', this.selectedForTestingStore);
    console.log('selectedForTestingStore.item', this.selectedForTestingStore.items);
    function mochaTest(Q, R) {
      const query = Q;
      const response = R;
      const str = `it('', () => {
        return integrationServer
        .graphqlQuery(app, 
          \`${query}\`
        )
        .then((response) => {
          expect(response.statusCode).to.equal(200);
          expect(response.body).to.have.deep.equals(
            \`${response}\`
          );
        });
      });`;
      return str;
    }
    let arr = [];
    let test = '';
    let i = 0;
    let len = this.selectedForTestingStore.items.length;

    while (i < len) {
      test =
        test +
        mochaTest(
          this.selectedForTestingStore.items[i].query,
          this.selectedForTestingStore.items[i].response
        );
      test = test + '\n';
      i++;
    }
    // arr.push(test);
    // const element = document.createElement("a");
    // const file = new Blob(arr, {type: 'text/plain'});
    // element.href = URL.createObjectURL(file);
    // element.download = "test.txt";
    // element.click();
  };
}
