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
  allHistoryQueries.forEach((entry) => {
    if (JSON.stringify(nextProps.operationName) === JSON.stringify(entry.operationName)) {
      if (
        JSON.stringify(nextProps.query) === JSON.stringify(entry.query)
        ) {
        if (
          JSON.stringify(nextProps.variables) ===
          JSON.stringify(entry.variables)
        ) {
          execute = false;
        }
        if (!nextProps.variables && !entry.variables) {
          execute = false;
        }
        execute = false;
      }
    }
  })
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
    storage: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.historyStore = new QueryStore('queries', props.storage);
    this.favoriteStore = new QueryStore('favorites', props.storage);
    const historyQueries = this.historyStore.fetchAll();
    const favoriteQueries = this.favoriteStore.fetchAll();
    const queries = historyQueries.concat(favoriteQueries);
    this.state = { queries };
  }

  componentWillReceiveProps(nextProps) {
    if (
      shouldSaveQuery(nextProps, this.props, this.historyStore.fetchRecent())
    ) {
      const item = {
        query: nextProps.query,
        variables: nextProps.variables,
        operationName: nextProps.operationName,
        response: nextProps.response,
      };
      this.historyStore.push(item);
      if (this.historyStore.length > MAX_HISTORY_LENGTH) {
        this.historyStore.shift();
      }
      const historyQueries = this.historyStore.items;
      const favoriteQueries = this.favoriteStore.items;
      const queries = historyQueries.concat(favoriteQueries);
      this.setState({
        queries,
      });
    }
  }

  render() {
    const queries = this.state.queries.slice().reverse();
    const queryNodes = queries.map((query, i) => {
      return (
        <HistoryQuery
          handleEditLabel={this.editLabel}
          handleToggleFavorite={this.toggleFavorite}
          key={i}
          onSelect={this.props.onSelectQuery}
          {...query}
        />
      );
    });
    return (
      <div>
        <div className="history-title-bar">
          <div className="history-title">{'Test Drawer'}</div>
          <div className="doc-explorer-rhs">
            {this.props.children}
          </div>
        </div>
        <div className="history-contents">
          {queryNodes}
        </div>
      </div>
    );
  }

  toggleFavorite = (query, variables, operationName, label, favorite) => {
    const item = {
      query,
      variables,
      operationName,
      label,
    };
    if (!this.favoriteStore.contains(item)) {
      item.favorite = true;
      this.favoriteStore.push(item);
    } else if (favorite) {
      item.favorite = false;
      this.favoriteStore.delete(item);
    }
    this.setState({ ...this.historyStore.items, ...this.favoriteStore.items });
  };

  editLabel = (query, variables, operationName, label, favorite) => {
    const item = {
      query,
      variables,
      operationName,
      label,
    };
    if (favorite) {
      this.favoriteStore.edit({ ...item, favorite });
    } else {
      this.historyStore.edit(item);
    }
    this.setState({ ...this.historyStore.items, ...this.favoriteStore.items });
  };
}
