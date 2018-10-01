import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as _ from 'lodash';

import { Provider } from 'react-redux';
import { Store } from 'redux';
import { MuiThemeProvider } from '@material-ui/core/styles';

import { configureStore } from '../redux';

import './Voyager.css';
import './viewport.css';

import ErrorBar from './utils/ErrorBar';
import LoadingAnimation from './utils/LoadingAnimation';
import DocPanel from './panel/DocPanel';

import { SVGRender } from './../graph/';
import { Viewport } from './../graph/';

import { changeSchema, changeDisplayOptions, focusElement, selectNode, clearSelection, storePendingEdges } from '../actions/';

import { typeNameToId } from '../introspection/';
import { StateInterface } from '../reducers';

import { WorkerCallback } from '../utils/types';
import Settings from './settings/Settings';
import { theme } from './MUITheme';

type IntrospectionProvider = (query: string) => Promise<any>;

export interface VoyagerDisplayOptions {
  rootType?: string;
  skipRelay?: boolean;
  showLeafFields?: boolean;
  sortByAlphabet?: boolean;
  hideRoot?: boolean;
}

export interface VoyagerProps {
  _schemaPresets?: any;
  introspection: IntrospectionProvider | Object | boolean;
  displayOptions?: VoyagerDisplayOptions;
  hideDocs?: boolean;
  hideSettings?: boolean;
  workerURI?: string;
  loadWorker?: WorkerCallback;
  toggleQueryMode(): undefined;
  queryModeHandler(store: Object): undefined;
  inQueryMode: boolean;
  children?: React.ReactNode;
}

export default class Voyager extends React.Component<VoyagerProps> {
  static propTypes = {
    introspection: PropTypes.oneOfType([
      PropTypes.func.isRequired,
      PropTypes.object.isRequired,
      PropTypes.bool.isRequired,
    ]).isRequired,
    _schemaPresets: PropTypes.object,
    displayOptions: PropTypes.shape({
      rootType: PropTypes.string,
      skipRelay: PropTypes.bool,
      sortByAlphabet: PropTypes.bool,
      hideRoot: PropTypes.bool,
      showLeafFields: PropTypes.bool,
    }),
    hideDocs: PropTypes.bool,
    hideSettings: PropTypes.bool,
    workerURI: PropTypes.string,
    loadWorker: PropTypes.func,
    toggleQueryMode: PropTypes.func,
    queryModeHandler: PropTypes.func,
    inQueryMode: PropTypes.bool
  };
  
  viewport: Viewport;
  renderer: SVGRender;
  store: Store<StateInterface>;
  unsubscribe: Function;
  
  constructor(props) {
    super(props);
    this.store = configureStore();
    this.unsubscribe = () => {};
  }

  componentDidMount() {
    // init viewport and svg-renderer
    this.renderer = new SVGRender(this.store, this.props.workerURI, this.props.loadWorker);
    this.viewport = new Viewport(this.store, this.refs['viewport'] as HTMLElement);

    this.updateIntrospection();
  }

  componentWillUnmount() {
    this.viewport.destroy();
    this.renderer.unsubscribe();
  }

  updateIntrospection() {
    let displayOpts = normalizeDisplayOptions(this.props.displayOptions);

    this.store.dispatch(changeSchema(this.props.introspection, displayOpts));
  }

  componentDidUpdate(prevProps: VoyagerProps) {
    if (this.props.introspection !== prevProps.introspection) {
      this.updateIntrospection();
      return;
    }
    if (this.props.displayOptions !== prevProps.displayOptions) {
      let opts = normalizeDisplayOptions(this.props.displayOptions);
      this.store.dispatch(changeDisplayOptions(opts));
    }

    if (this.props.hideDocs !== prevProps.hideDocs) {
      this.viewport.resize();
    }
  }
  
  shouldComponentUpdate(nextProps: VoyagerProps) {
    if (nextProps.inQueryMode && !this.props.inQueryMode) {
      this.unsubscribe = this.store.subscribe(() => {
        const { selected } = this.store.getState();
        const storedSelections = { history:selected.queryModeHistory, currentFields: selected.multipleEdgeIds };
        return this.props.queryModeHandler(storedSelections);
      });
      //TODO abstract this into getRootFromProps()
      let root = 'TYPE::' + nextProps.introspection["_queryType"].name;
      this.store.dispatch(focusElement(root));
      this.store.dispatch(selectNode(root));
    } else if (!nextProps.inQueryMode && this.props.inQueryMode) {
      this.unsubscribe();
      // store all pending edges in query history before clearing
      this.store.dispatch(storePendingEdges());
      this.store.dispatch(clearSelection());
    }
    return true;
  }

  render() {
    let { hideDocs = false, hideSettings } = this.props;

    const children = React.Children.toArray(this.props.children);

    const panelHeader = children.find(
      (child: React.ReactElement<any>) => child.type === Voyager.PanelHeader,
    );

    return (
      <Provider store={this.store}>
        <MuiThemeProvider theme={theme}>
          <div className="graphql-voyager">
            {!hideDocs && <DocPanel 
              header={panelHeader} 
              toggleQueryMode={this.props.toggleQueryMode} 
              inQueryMode={this.props.inQueryMode}/>}
            {!hideSettings && <Settings />}
            <div ref="viewport" className="viewport">
              <LoadingAnimation />
            </div>
            <ErrorBar />
            
          </div>
        </MuiThemeProvider>
      </Provider>
    );
  }

  static PanelHeader = props => {
    return props.children || null;
  };
}

function normalizeDisplayOptions(opts: VoyagerDisplayOptions = {}) {
  return {
    ...opts,
    rootTypeId: opts.rootType && typeNameToId(opts.rootType),
  };
}
