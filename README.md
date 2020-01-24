# solo-koala-64 (Google Fonts App: Tier 2) 

This web app lets you play around with the most popular Google Fonts almost like in [fonts.google.com](https://fonts.google.com) but different and with simplistic style :D. Check it out here: [solo-koala-64 (to come ... )](#). <br />
It even offers some additional functionality like random shuffling font-cards - maybe you discover a new font out there.
However, there are still some [Issues and TODOs](#issues-and-todos).


### Prerequisites

- npm
- typescript


## Installation

```
git clone [this repo] 
cd [local repository]

#Delete package-lock.json
rm ./package-lock.json

npm install
```

### Run it 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). and Typesccript <br />

```
npm start
```

<details><summary>Create React App Commands</summary>
<p>
In the project directory, you can run (Available Scripts):

```
npm start
```

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

```
npm test
```
Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

```
npm run build
```

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

```
npm run eject`
```

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

</p>
</details>


## Issues and TODOs

### Styling Issues

- The Bootstrap Navbar is more of a placeholder and no real links or tools implemented. It is not fully customized according to app-style and does not sticky disappear on up-scroll.
- the [react-window](https://github.com/bvaughn/react-window) Components render the visible fonts-list fast, but make harder to display it in a responsive way. Therefore, the height of font-cards respond to text-input and text-size as [calculated here](https://github.com/Chingu-Solo/solo-koala-64/blob/092731ef64b213b8350e61aca0d4c8e022d52498/src/Cards.tsx#L174) but not exactly.
- Text-input fields for font-search and card-text do not span available space.

### State Issues

- Persistence: The fonts requested from Google API get [copied to a Backup state variable](https://github.com/Chingu-Solo/solo-koala-64/blob/092731ef64b213b8350e61aca0d4c8e022d52498/src/App.tsx#L61). Probably this would rather be managed with [Redux](https://redux.js.org/) or [MobX](https://mobx.js.org/README.html). I want to learn those state management tools next:).
- The backup state does sometimes get messed up, when too much shuffling and deleteing of fonts - and I would have to test more to find exact reason (which is actually a severe issue).

### Testing Shortcomings

- ./__tests__/App.tests.tsx there is a problem with mocking fetch. So no tests work currently ! Ther problem originates in ... ./common/utils/ApiUtils.ts. And I didn't find a way to mock the ComponentDidMount method and initiate some state workaround. Please help. The tests shallow rendering (enzyme) of App.tsx worked sometimes but but failed otherwise.
- ./common/utils/__tests__/ApiUtils.test.ts lacks alot of testing, there is a list missing cases. I could not establish to test whether api request throws an error if !response.ok
- I did not do coverage checks yet - but alot is uncovered.
