![Static Web App Deployment](https://github.com/SLO-308-Project/Workout-In-Progress/actions/workflows/Deploy-Static-WebApp.yml/badge.svg)

![API Deployment](https://github.com/SLO-308-Project/Workout-In-Progress/actions/workflows/Deploy-Backend-API.yml/badge.svg)

# 308-Project
### Team
- Paul Motter
- Tyler Pham
- Josh Cavender
- David Veronov
 
# Workout In Progress
Workout In Progress is a workout tracking application. It helps keep track of when and what workouts you have completed, provides statistics on what has been completed, and provides tools for easily inputting workouts. Our goal is to create an app that eliminates a lot of the extra and unnecessary features that most workout apps provide. Trim down these elements into the core functionality that is easy and efficient to use.

# Feature Demos

## Track your progress on a machine
![CleanShot 2025-06-05 at 17 19 37](https://github.com/user-attachments/assets/e9c09abd-9804-4e4c-91da-a6420dff9890)

## Complete "machine" customization
![CleanShot 2025-06-05 at 17 21 01](https://github.com/user-attachments/assets/f0a1c904-69cc-44ac-91e3-9eb582f63dfa)

## User authentication
![CleanShot 2025-06-05 at 17 25 11](https://github.com/user-attachments/assets/758a76f8-e5c1-472d-967c-c97f395f433a)

## Track your workout as you're doing it
![CleanShot 2025-06-05 at 17 27 44](https://github.com/user-attachments/assets/96f114a3-510e-4fcd-943b-0759af6a8ed8)

## Start a new session from an old one with templates
![CleanShot 2025-06-05 at 17 29 21](https://github.com/user-attachments/assets/e3727a49-63f3-4d43-a18f-33da8f8b5b1f)

## Share your template with other gym-goers
![CleanShot 2025-06-05 at 17 33 09](https://github.com/user-attachments/assets/68cbcc61-c5a4-4ec4-b53b-df74f0358bad)

## Deployment
[Frontend Link](https://orange-bush-0991c211e.6.azurestaticapps.net)

[Backend Test URL: "Hello World"](https://workoutinprogressapi-fhdwaeeafkayegcw.westus-01.azurewebsites.net/)

## Tech Spec Document
[Tech Spec Doc](https://docs.google.com/document/d/1pv5Od8G1ek-ETLHgJwQMxAxre_nD8fRDjutjLOnxXK0/edit?usp=sharing)

## Figma Prototype
[Figma Project](https://www.figma.com/design/40heWTG7s883OhvNfuJlLm/pmotter's-team-library?node-id=0-1&t=s2ZUUt3js5H2pfjs-1)

[Figma Prototype Demo](https://www.figma.com/proto/40heWTG7s883OhvNfuJlLm/pmotter's-team-library?node-id=3317-2&p=f&t=qPZslnocKgtIEETe-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=3317%3A2)

## UML Diagrams
[UML Class Diagram](https://drive.google.com/file/d/1ltDPBsD1gQQ0TONN-j8DJo3RjuxZuwwO/view?usp=sharing)

[UML Use Case Diagram](https://drive.google.com/file/d/13Lz_-dlQdHMw1UA3KrU9TH2LY3W08dgx/view?usp=sharing)

[UML Activity Diagram](https://drive.google.com/file/d/1RCC0hqDVSrnWCDgpppQ3kv7xycMe5lVk/view?usp=sharing)

[UML Sequence Diagram](https://drive.google.com/file/d/1S_xFfHS6SZ_wBLoxX58UuUnBaugZcNzJ/view?usp=sharing)

## Test Coverage Reports
Date: 6/4/2025 11pm 

### Acceptance Testing
[Acceptance Criteria](https://docs.google.com/document/d/1ZeTDSAWvSG_OFoRWgSXM6aJ3mfvQuhRCuX34Si96XJc/edit?tab=t.0) <br />

<img width="739" alt="image" src="https://github.com/user-attachments/assets/0662ffa5-d289-4d01-a121-82056bfe4a43" />


### Backend Report: <br />
![image](https://github.com/user-attachments/assets/d2dc468f-6317-4e39-aa99-676a5d35f6c4)


## Setup for dev
1. Clone entire repo.
2. Run ```npm install``` in the main directory to install all current dependencies.
3. Create a .env file for both the frontend and backend packages
    - NOTE: Saving and Copying Templates are unable to run on local databases due to Transactions requiring replicas
    - Frontend
      ```
        # Use http://10.0.2.2:8000 when running android simulator
         EXPO_PUBLIC_API_URL=<BACKEND_SERVER>
      ```
    - Backend
      ```
          DB_URL = <MONGO_URL>
          JWT_SECRET = <SECRET>
      ```
4. Use [Expo's guide](https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated&mode=expo-go) for setting up an Expo development environment.
5. VScode Extensions:
    - "JavaScript and TypeScript Nightly"
    - "Prettier - Code formatted"
        1. (CMD/ CTRL) + SHIFT + P
        2. Search "Open User Settings" And Open
        3. Search "Format On Save" And Ensure It is Checked
        4. Search "Default Formatter" And Set It To Prettier Code Formatter
    - "ESLint"
    - "Babel JavaScript"
    - "Tailwind CSS IntelliSense" This will add autocomplete to tailwind CSS classNames.
       1. Open VScode settings to "file association" and add the item "*css" and value "tailwindcss". 
       2. Open VScode settings to "editor quick suggestions" and change strings to on.

## Scripts
- ```npm run backdev``` Runs the dev environment for the backend.
- ```npm run frontdev``` Runs the dev environment for the frontend.
- ```npm run test``` Runs jest tests for all workspaces or the current workspace.
- ```npm run test-e2e``` Runs cypress e2e tests for API and UI
- ```npm run test-e2e-interactive``` Run cypress e2e tests interactively
- ```npm run coverage``` Runs jest tests with coverage report for all workspaces or the current workspace.
- ```npm run prepare``` Runs husky pre commit checks
- ```npm run format``` Runs the prettier formatter for all files.
- ```npm run lint``` Runs the ESlint for all workspaces.

## Conventional Commits
```
[type] [optional (scope)] [optional !]: [description]
```
e.g.
```
feat(users)!: Implemented GET endpoint.
```
**Different Types**:
 
1. ```feat```: Introduces a new feature to your application.
2. ```fix```: Represents a bug fix.
3. ```docs```: Covers changes to documentation only.
4. ```style```: Deals with code style changes (e.g., formatting, missing semicolons) that do not affect the meaning of the code.
5. ```refactor```: Indicates a code change that neither fixes a bug nor adds a feature (e.g., improving code readability).
6. ```test```: Relates to adding or updating tests.
7. ```build```: Pertains to changes affecting the build system or external dependencies (e.g., updating webpack or npm packages).
8. ```chore```: For other changes that do not modify source or test files, such as maintenance tasks.
9. ```revert```: Used when reverting previous commits.

**Optional Scope**: Consists of a noun describing a section of the codebase surrounded by parenthesis. e.g., fix(parser)

**Optional !**: An "!" emphasizes importance.

**Description**: A short description/summary of code changes.
