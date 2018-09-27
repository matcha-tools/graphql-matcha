import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import * as classNames from 'classnames';

import './TypeDoc.css';

import { SimplifiedTypeWithIDs } from '../../introspection/types';

import { selectEdge, selectNode, focusElement, queryModeEnabled } from '../../actions';
import { getSelectedType } from '../../selectors';
import { getTypeGraphSelector } from '../../graph';
import TypeList from './TypeList';
import DocNavigation from './DocNavigation';
import Markdown from '../utils/Markdown';
import Description from './Description';
import TypeLink from './TypeLink';
import WrappedTypeName from './WrappedTypeName';
import Argument from './Argument';

interface TypeDocProps {
  selectedType: any;
  selectedEdgeId: string;
  typeGraph: any;
  dispatch: any;
  queryMode: boolean;
}

function mapStateToProps(state) {
  return {
    selectedType: getSelectedType(state),
    selectedEdgeId: state.selected.currentEdgeId,
    typeGraph: getTypeGraphSelector(state),
    queryMode: state.queryMode
  };
}

class TypeDoc extends React.Component<TypeDocProps> {
  componentDidUpdate(prevProps: TypeDocProps) {
    if (this.props.selectedEdgeId !== prevProps.selectedEdgeId) {
      this.ensureActiveVisible();
    }
  }

  ensureActiveVisible() {
    let itemComponent = this.refs['selectedItem'] as HTMLElement;
    if (!itemComponent) return;

    itemComponent.scrollIntoViewIfNeeded();
  }

  renderTypesDef(type: SimplifiedTypeWithIDs, typeGraph, selectedId: string) {
    let typesTitle;
    let types: {
      id: string;
      type: SimplifiedTypeWithIDs;
    }[];
    let dispatch = this.props.dispatch;

    switch (type.kind) {
      case 'UNION':
        typesTitle = 'possible types';
        types = type.possibleTypes;
        break;
      case 'INTERFACE':
        typesTitle = 'implementations';
        types = type.derivedTypes;
        break;
      case 'OBJECT':
        typesTitle = 'implements';
        types = type.interfaces;
        break;
      default:
        return null;
    }

    types = _.filter(types, type => typeGraph.nodes[type.type.id] !== undefined);
    if (_.isEmpty(types)) return null;

    return (
      <div className="doc-category">
        <div className="title">{typesTitle}</div>
        {_.map(types, type => {
          let props: any = {
            key: type.id,
            className: classNames('item', {
              '-selected': type.id === selectedId,
            }),
            onClick: () => {
              dispatch(selectEdge(type.id));
            },
          };
          if (type.id === selectedId) props.ref = 'selectedItem';
          return (
            <div {...props}>
              <TypeLink type={type.type} />
              <Description text={type.type.description} className="-linked-type" />
            </div>
          );
        })}
      </div>
    );
  }

  renderFields(type: SimplifiedTypeWithIDs, selectedId: string) {
    if (_.isEmpty(type.fields)) return null;

    let dispatch = this.props.dispatch;

    // wrapped type name is where the redirect happens

    return (
      <div className="doc-category">
        <div className="title">{'fields'}</div>

        {_.map(type.fields, field => {
          let props: any = {
            key: field.name,
            className: classNames('item', {
              '-selected': field.id === selectedId,
              '-with-args': !_.isEmpty(field.args),
            }),
            onClick: () => {
              dispatch(selectEdge(field.id));
            },
          };
          if (field.id === selectedId) props.ref = 'selectedItem';
          return (
            <div {...props}>
              <a className="field-name">{field.name}</a>
              <span
                className={classNames('args-wrap', {
                  '-empty': _.isEmpty(field.args),
                })}
              >
                {!_.isEmpty(field.args) && (
                  <span key="args" className="args">
                    {_.map(field.args, arg => (
                      <Argument key={arg.name} arg={arg} expanded={field.id === selectedId} />
                    ))}
                  </span>
                )}
              </span>
              <WrappedTypeName container={field} />
              {field.isDeprecated && <span className="doc-alert-text">{' (DEPRECATED)'}</span>}
              <Markdown text={field.description} className="description-box -field" />
            </div>
          );

        })}

      </div>
    );
  }

  renderQueryModeTypesDef(type: SimplifiedTypeWithIDs, typeGraph, selectedId: string) {
    let typesTitle;
    let types: {
      id: string;
      type: SimplifiedTypeWithIDs;
    }[];
    let dispatch = this.props.dispatch;

    switch (type.kind) {
      case 'UNION':
        typesTitle = 'possible types';
        types = type.possibleTypes;
        break;
      case 'INTERFACE':
        typesTitle = 'implementations';
        types = type.derivedTypes;
        break;
      case 'OBJECT':
        typesTitle = 'implements';
        types = type.interfaces;
        break;
      default:
        return null;
    }

    types = _.filter(types, type => typeGraph.nodes[type.type.id] !== undefined);
    if (_.isEmpty(types)) return null;

    return (
      <div className="doc-category">
        <div className="title">{typesTitle}</div>
        {_.map(types, type => {
          let props: any = {
            key: type.id,
            className: classNames('item', {
              '-selected': type.id === selectedId,
            }),
            onClick: () => {
              dispatch(selectEdge(type.id));
            },
          };
          if (type.id === selectedId) props.ref = 'selectedItem';
          return (
            <div {...props}>
              <TypeLink type={type.type} />
              <Description text={type.type.description} className="-linked-type" />
            </div>
          );
        })}
      </div>
    );
  }

  renderQueryModeFields(type: SimplifiedTypeWithIDs, selectedId: string) {
    // make sure there are fields to populate
    if (_.isEmpty(type.fields)) return null;

    let dispatch = this.props.dispatch;

    // utilize the field.type to trigger a redirect, rather than utilizing the onclick functionality of wrapper container, this makes life easier for query mode. enable it on the onclick.

    return (
      <div className="doc-category">
        <div className="title">{'fields'}</div>

        {_.map(type.fields, field => {
          let props: any = {
            key: field.name,
            className: classNames('item', {
              '-selected': field.id === selectedId,
              '-with-args': !_.isEmpty(field.args),
            }),
            onClick: (event) => {
              dispatch(selectEdge(field.id)); // just need to capture id, don't need to select edge
              event.stopPropagation() // helps with redirect for now
              dispatch(focusElement(field.type.id)); // passing in node
              dispatch(selectNode(field.type.id));
            },
          }; // these onclicks pertain strictly to nodes in first selection of querymode
          if (field.id === selectedId) props.ref = 'selectedItem';

          return (
            <div {...props}>
              <a className="field-name">{field.name}</a>
              <span
                className={classNames('args-wrap', {
                  '-empty': _.isEmpty(field.args),
                })}
              >
                {!_.isEmpty(field.args) && (
                  <span key="args" className="args">
                    {_.map(field.args, arg => (
                      <Argument key={arg.name} arg={arg} expanded={field.id === selectedId} />
                    ))}
                  </span>
                )}
              </span>
              <WrappedTypeName container={field} />
              {field.isDeprecated && <span className="doc-alert-text">{' (DEPRECATED)'}</span>}
              <Markdown text={field.description} className="description-box -field" />
            </div>
          );

        })}

      </div>
    );
  }
  queryMode = () => { // arrow function to bind the context of this. 

    // selecting query mode should refocus to the root node and allow for selection process. 
    this.props.dispatch(focusElement('TYPE::Root'))
    this.props.dispatch(selectNode('TYPE::Root'))

    // enable query mode
    this.props.dispatch(queryModeEnabled(true))

    // what does event progragation do? Would that be needed here?
    this.generateQueries()
  }

  generateQueries = () => {

  }

  render() {
    const { selectedType, selectedEdgeId, typeGraph, queryMode } = this.props;

    if (!typeGraph) {
      return (
        <div className="type-doc">
          <span className="loading"> Loading... </span>;
        </div>
      );
    }

    let displayQueryMode;
    if (queryMode) {
      displayQueryMode = (
        <div>
          <h1> Test </h1>
          <Description className="-doc-type" text={selectedType.description} />
          {this.renderQueryModeTypesDef(selectedType, typeGraph, selectedEdgeId)}
          {this.renderQueryModeFields(selectedType, selectedEdgeId)}
        </div>
      )
    }

    // current method bugs out because cannot read description of null when clicking back to query mode. attaching to end for now. 
    // error pops up: Cannot read property 'getPan' of undefinedCannot read property 'getPan' of undefinedCannot read property 'getPan' of undefined

    return (
      <div className="type-doc">
        <DocNavigation />
        <button onClick={this.queryMode}>QueryMode</button>
        <div className="scroll-area">
          {!selectedType ? (
            <TypeList typeGraph={typeGraph} />
          ) : (
            <div>
              <Description className="-doc-type" text={selectedType.description} />
              {this.renderTypesDef(selectedType, typeGraph, selectedEdgeId)}
              {this.renderFields(selectedType, selectedEdgeId)}
            </div>
          )}
        {displayQueryMode}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(TypeDoc);
