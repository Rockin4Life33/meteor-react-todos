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

    this.state = {
      hideCompleted: false
    };
  }

  handleSubmit ( event ) {
    event.preventDefault();

    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode( this.refs.textInput ).value.trim();

    Tasks.insert( {
      text, // the task text/title
      isComplete: false, // is the task complete
      createdAt: new Date(), // current time
      owner: Meteor.userId(), // _id of logged in user
      username: Meteor.user().username // username of logged in user
    } );

    // Clear form
    ReactDOM.findDOMNode( this.refs.textInput ).value = '';
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

    // return this.props.tasks.map( ( task ) => (
    return filteredTasks.map( ( task ) => (
        <Task key={task._id} task={task} />
    ) );
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
               <input type="text" ref="textInput" placeholder="Submit New Todo Here" />
             </form> : ''
            }
          </header>

          <ul>
            {this.renderTasks()}
          </ul>
        </div>
    );
  }
}

export default withTracker( () => {
  return {
    tasks: Tasks.find( {}, { sort: { createdAt: -1 } } ).fetch(),
    incompleteCount: Tasks.find( { isComplete: false } ).count(),
    currentUser: Meteor.user()
  };
} )( App );
