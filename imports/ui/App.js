import './App.html';

import { Template } from 'meteor/templating';

import Sortable from 'sortablejs';

import { TasksCollection }
from '../api/TasksCollection';

Template.App.helpers({

  tasks() {

    return TasksCollection.find(
      {},
      {
        sort: {
          order: 1
        }
      }
    );

  },

  checkedClass() {

    return this.isChecked
      ? 'completed'
      : '';

  },

  categoryClass() {

  if (this.category === 'Work')
    return 'work';

  if (this.category === 'Personal')
    return 'personal';

  if (this.category === 'Urgent')
    return 'urgent';

}

});

Template.App.events({

  'submit .task-form'(event) {

    event.preventDefault();

    const text =
      event.target.text.value;

    const category =
      event.target.category.value;

    const count =
      TasksCollection.find().count();

    TasksCollection.insert({

      text,

      category,

      isChecked: false,

      order: count,

      createdAt: new Date()

    });

    event.target.text.value = '';

  },

  'click .toggle'() {

    TasksCollection.update(
      this._id,
      {
        $set: {
          isChecked:
            !this.isChecked
        }
      }
    );

  },

  'click .delete'() {

    TasksCollection.remove(
      this._id
    );

  }

});

Template.App.onRendered(function () {

  Sortable.create(

    document.getElementById(
      'taskList'
    ),

    {

      animation: 150,

      onEnd(evt) {

        const tasks =
          TasksCollection.find(
            {},
            {
              sort: {
                order: 1
              }
            }
          ).fetch();

        const moved =
          tasks.splice(
            evt.oldIndex,
            1
          )[0];

        tasks.splice(
          evt.newIndex,
          0,
          moved
        );

        tasks.forEach(
          (task, index) => {

            TasksCollection.update(
              task._id,
              {
                $set: {
                  order: index
                }
              }
            );

          }
        );

      }

    }

  );

});