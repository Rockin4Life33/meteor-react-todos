import React, { Component } from 'react';
import { Meteor }           from 'meteor/meteor';
import classnames           from 'classnames';

// Task component - represents a single todo item
export default class Task extends Component {
  toggleChecked () {
    // Set the checked property to the opposite of its current value
    Meteor.call( 'tasks.setChecked', this.props.task._id, !this.props.task.isComplete );
  }

  togglePrivate () {
    Meteor.call( 'tasks.setPrivate', this.props.task._id, !this.props.task.isPrivate );
  }

  deleteThisTask () {
    Meteor.call( 'tasks.remove', this.props.task._id );
  }

  render () {
    // Give tasks a different className when they are checked off, so that we can style them nicely in CSS
    const taskClassName = classnames( {
      checked: this.props.task.isComplete,
      private: this.props.task.isPrivate
    } );

    return (
        <li className={taskClassName}>
          <button className="delete" onClick={this.deleteThisTask.bind( this )}>&times;</button>

          <input
              type="checkbox"
              readOnly
              checked={this.props.task.isComplete}
              onClick={this.toggleChecked.bind( this )}
          />

          {this.props.showIsPrivateBtn ? (
              <button className="toggle-private" onClick={this.togglePrivate.bind( this )}>
                {this.props.task.isPrivate ? 'Private' : 'Public'}
              </button>
          ) : ''}

          <span className="text"><b>{this.props.task.username}</b>: {this.props.task.text}</span>
        </li>
    );
  }
}
