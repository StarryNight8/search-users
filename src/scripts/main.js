/* jshint esversion: 6 */
import $ from 'jquery';

const Main = {
  initApp() {
    const usersHolder = document.querySelector('.c-users');

    let users = {};
    let originalUsers = {};
    let numUsersDisplayed = 0;

    const SCROLL_RANGE = 900;
    let scrollMax = SCROLL_RANGE;

    loadUsersList();

    /*
     * Load users list
     */
    function loadUsersList() {
      console.time('test - load json');

      $.ajax({
        url: '/dist/assets/json/users.js',
        dataType: 'json',
        success: function(data) {
          originalUsers = data.result;
          users = data.result;

          console.timeEnd('test - load json');
          displayUsers(users, false);
        }
      });
    }

    /*
     * Display users in a list
     */
    function displayUsers (usersToDisplay, loadMore) {
      console.time('test - display users');

      let users = '';
      let amountToLoad = 25;

      if (!loadMore) {
        numUsersDisplayed = 0;
      }

      for (
        let i = numUsersDisplayed; i < numUsersDisplayed + amountToLoad && i < usersToDisplay.length; i++
      ) {

        // user name
        let userName = `<span>${usersToDisplay[i].name}</span>`;

        // user avatarUrl
        let userAvatarUrl = `<img src="${usersToDisplay[i].avatarUrl}">`;

        users += `<li>${userName + userAvatarUrl}</li>`;
      }
      usersHolder.innerHTML += users;

      numUsersDisplayed += amountToLoad;

      console.timeEnd('test - display users');
    }

    /*
     * Create a user
     */
    function createUser (userToDisplay) {
      let user = {
        name: userToDisplay.name,
        avatarUrl: userToDisplay.avatarUrl,
      };

      return user;
    }

    // overlook user typing
    document
      .querySelector('#search-txt')
      .addEventListener('input', onKeyStrokeEntered);

    function onKeyStrokeEntered() {
      let inputValue = this.value;

      if (inputValue !== '') {

        clearUsersHolder();

        console.time('test - search and display users');

        let usersToDisplay = [];

        // find user names (from initial list) that start with entered keystroke
        for (let g = 0; g < users.length; g++) {
          if (users[g].name.toLowerCase().startsWith(inputValue)) {
            // sort matching users and put them in array
            usersToDisplay.push(createUser(users[g]));
          }
        }
        users = usersToDisplay;
        displayUsers(users, false);

        console.timeEnd('test - search and display users');

      } else {

        clearUsersHolder();

        users = originalUsers;

        displayUsers(users, false);
      }
    }

    /*
     * Remove all results
     */
    function clearUsersHolder() {

      while (usersHolder.lastChild) {
        usersHolder.removeChild(usersHolder.lastChild);
      }
      scrollMax = SCROLL_RANGE;
      document.querySelector('.c-users').scrollTop = 0;
    }

    /*
     * Display more users on scroll
     */
    document.querySelector('.c-users').addEventListener('scroll', function(e) {

      if (this.scrollTop > scrollMax) {
        scrollMax += SCROLL_RANGE;
        displayUsers(users, true);
      }
    });
  }
};
module.exports = Main;