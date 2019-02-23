import React, { Component } from 'react';
import ReactDOM             from 'react-dom';
import { Meteor }           from 'meteor/meteor';
import { withTracker }      from 'meteor/react-meteor-data';
import { Tasks }            from '../api/tasks';
import Task                 from './components/Task.jsx';
import AccountsUIWrapper    from './layouts/AccountsUIWrapper';

// App component - represents the whole app
class App extends Component {
  constructor ( props ) {
    super( props );

    // Init the state
    this.state = {
      hideCompleted: false
    };

    // Create refs
    this.taskInput = React.createRef();
  }

  handleSubmit ( event ) {
    event.preventDefault();

    // Find the text field via the React ref
    const { value } = ReactDOM.findDOMNode( this.taskInput.current );

    Meteor.call( 'tasks.insert', value.trim() );

    // Clear form
    ReactDOM.findDOMNode( this.taskInput.current ).value = '';
  }

  toggleHideCompleted () {
    this.setState( {
      hideCompleted: !this.state.hideCompleted
    } );
  }

  renderTasks () {
    let filteredTasks = this.props.tasks;

    if ( this.state.hideCompleted ) {
      filteredTasks = filteredTasks.filter( task => !task.isComplete );
    }

    return filteredTasks.map( task => {
      const curUserId = this.props.currentUser && this.props.currentUser._id;
      const showIsPrivateBtn = task.owner === curUserId;

      return (
          <Task
              key={task._id}
              task={task}
              showIsPrivateBtn={showIsPrivateBtn}
          />
      );
    } );
  }

  render () {
    return (
        <div className="container">
          <header>
            <h1><u>Todo List</u> (incomplete: {this.props.incompleteCount})</h1>

            <label className="hide-completed">
              <input
                  type="checkbox"
                  checked={this.state.hideCompleted}
                  onClick={this.toggleHideCompleted.bind( this )}
                  readOnly
              />
              Hide Completed Tasks
            </label>

            <AccountsUIWrapper />

            {this.props.currentUser ?
             <form className="new-task" onSubmit={this.handleSubmit.bind( this )}>
               <input type="text" ref={this.taskInput} placeholder="Submit New Todo Here" />
             </form> : ''
            }
          </header>

          <ul>{this.renderTasks()}</ul>
        </div>
    );
  }
}

export default withTracker( () => {
  // Create subscriptions
  Meteor.subscribe( 'tasks' );

  // Return App globals
  return {
    tasks: Tasks.find( {}, { sort: { createdAt: -1 } } ).fetch(),
    incompleteCount: Tasks.find( { isComplete: false } ).count(),
    currentUser: Meteor.user()
  };
} )( App );
