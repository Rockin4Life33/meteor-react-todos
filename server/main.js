import { Meteor } from 'meteor/meteor';
import { Tasks }  from '/imports/api/tasks';

function insertTask ( text, isComplete = false ) {
  Tasks.insert( { text, isComplete, createdAt: new Date() } );
}

Meteor.startup( () => {
  // If the Tasks collection needs to be cleared out uncomment the line below: Remember to restart the app for this
  // Tasks.remove( {} );

  // If the Tasks collection is empty, add some data.
  if ( Tasks.find().count() === 0 ) {
    insertTask( 'Hello World!', false );
    insertTask( 'Another Test', true );
    insertTask( 'Boogie Boogie', false );
  }
} );
