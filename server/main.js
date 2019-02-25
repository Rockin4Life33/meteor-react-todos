import { Meteor } from 'meteor/meteor';
import { Tasks }  from '/imports/api/tasks';

function insertTask ( text, isComplete = false, isPrivate = false ) {
  Tasks.insert( { text, isComplete, isPrivate, createdAt: new Date() } );
}

Meteor.startup( () => {
  // If the Tasks collection needs to be cleared out uncomment the line below: Remember to restart the app for this
  // Tasks.remove( {} );

  // If the Tasks collection is empty, add some data.
  if ( Tasks.find().count() === 0 ) {
    insertTask( 'Hello World!', false, false );
    insertTask( 'Another Test', true, false );
    insertTask( 'Boogie Boogie', false, true );
  }
} );
