import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import * as classNames from 'classnames';

import './TypeDoc.css';

import { SimplifiedTypeWithIDs } from '../../introspection/types';

import { selectEdge, selectNode, focusElement, storeNodeAndEdges, storeEdges } from '../../actions';
import { getSelectedType } from '../../selectors';
import { getTypeGraphSelector } from '../../graph';
import TypeList from './TypeList';
import DocNavigation from './DocNavigation';
import Markdown from '../utils/Markdown';
import Description from './Description';
import TypeLink from './TypeLink';
import WrappedTypeName from './WrappedTypeName';
import Argument from './Argument';
import { isScalarType } from '../../introspection/utils';

interface TypeDocProps {
  selectedType: any;
  selectedEdgeId: string;
  typeGraph: any;
  dispatch: any;
  toggleQueryMode: any;
  inQueryMode: boolean;
  selectedFields: any;
  svg: string;
}

function mapStateToProps(state) {
  return {
    selectedType: getSelectedType(state),
    selectedEdgeId: state.selected.currentEdgeId,
    typeGraph: getTypeGraphSelector(state),
    selectedFields: state.selected.multipleEdgeIds,
    svg: state.graphView.svg,
  };
}

class TypeDoc extends React.Component<TypeDocProps> {
  constructor(props) {
    super(props);
  }

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

    return (
      <div className="doc-category">
        <div className="title">{'fields'}</div>

        {_.map(type.fields, field => {
          let highlight = field.id === selectedId;
          if(this.props.inQueryMode && field.id && this.props.selectedFields){
            highlight = _.includes(this.props.selectedFields, field.id);
          }
          
          let props: any = {
            key: field.name,
            className: classNames('item', {
              '-selected': highlight,
              '-with-args': !_.isEmpty(field.args),
            }),
            onClick: () => {
              // if query mode is on, on-clicks will help generate query 
              if (this.props.inQueryMode) {
                // store selected scalars, to be added to history when navigating to a new node
                if (isScalarType(field.type)) {
                  dispatch(storeEdges(field.id));
                  dispatch(selectEdge(field.id));
                } else {
                  // navigate to the new node, store previously selected edges and new node in history
                  dispatch(focusElement(field.type.id));
                  dispatch(selectNode(field.type.id));
                  dispatch(storeNodeAndEdges(field));
                }
              } else {
                // if query mode is not on, resume normal operations
                dispatch(selectEdge(field.id));
              }
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

  render() {
    const { selectedType, selectedEdgeId, typeGraph } = this.props;

    if (!typeGraph) {
      return (
        <div className="type-doc">
          <span className="loading"> Loading... </span>
        </div>
      );
    }

    return (
      <div className="type-doc">
        <DocNavigation 
          inQueryMode={this.props.inQueryMode} 
          svg={this.props.svg}
          toggleQueryMode={this.props.toggleQueryMode}/>
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
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(TypeDoc);
