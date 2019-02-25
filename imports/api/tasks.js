import { Meteor } from 'meteor/meteor';
import { Mongo }  from 'meteor/mongo';
import { check }  from 'meteor/check';

export const Tasks = new Mongo.Collection( 'tasks' );

if ( Meteor.isServer ) {
  Meteor.publish( 'tasks', function tasksPublication () {
    return Tasks.find( {
      $or: [
        { isPrivate: false },
        { owner: this.userId }
      ]
    } );
  } );
}

Meteor.methods( {
  'tasks.insert' ( text ) {
    check( text, String );

    // Make sure the user is logged in before inserting a task
    if ( !this.userId ) {
      throw new Meteor.Error( 'not-authorized' );
    }

    Tasks.insert( {
      owner: this.userId,
      username: Meteor.users.findOne( this.userId ).username,
      text,
      isComplete: false,
      isPrivate: false,
      createdAt: new Date()
    } );
  },

  'tasks.remove' ( taskId ) {
    check( taskId, String );

    const task = Tasks.findOne( taskId );

    if ( task.isPrivate && task.owner !== this.userId ) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error( 'not-authorized' );
    }

    Tasks.remove( taskId );
  },

  'tasks.setChecked' ( taskId, setChecked ) {
    check( taskId, String );
    check( setChecked, Boolean );

    const task = Tasks.findOne( taskId );

    if ( task.isPrivate && task.owner !== this.userId ) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error( 'not-authorized' );
    }

    Tasks.update( taskId, { $set: { isComplete: setChecked } } );
  },

  'tasks.setPrivate' ( taskId, isPrivate ) {
    check( taskId, String );
    check( isPrivate, Boolean );

    const task = Tasks.findOne( taskId );

    // Make sure only the task owner can make a task private
    if ( task && task.owner !== this.userId ) {
      throw new Meteor.Error( 'not-authorized' );
    }

    Tasks.update( taskId, { $set: { isPrivate } } );
  }
} );
