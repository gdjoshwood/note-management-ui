# Note Management UI

Welcome to the Note Management UI! Where you can create, update, and delete any notes all in one place. Localstorage ensures serialization of your note collection and you can prioritize & search through them.

Small caveat according to specification _"Allow note priority and sort order to be changed by moving them from group to group."_ means that when you change the priority for a note, its auto-increment index will be updated to push it to the bottom of the list. This ensures sort order is changed as a result of moving notes from group to group.

# Pre-requisites
## Software

- [Node](https://nodejs.org/en/download/)
- [Git](https://git-scm.com/)
- [yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable)

## Installing Dependencies
### `yarn`

Fetch all 3rd-party dependencies necessary to run the app

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

