# 308-Project

# Workout In Progress
Product Vision: A workout logger for tracking workouts and viewing past workouts.

## Figma Prototype
[Figma Project](https://www.figma.com/design/40heWTG7s883OhvNfuJlLm/pmotter's-team-library?node-id=0-1&t=s2ZUUt3js5H2pfjs-1)

[Figma Prototype Demo](https://www.figma.com/proto/40heWTG7s883OhvNfuJlLm/pmotter's-team-library?node-id=3317-2&p=f&t=qPZslnocKgtIEETe-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=3317%3A2)

## UML Diagram
[Draw.io UML Diagram](https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&layers=1&nav=1&title=UML%20Diagram#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1ltDPBsD1gQQ0TONN-j8DJo3RjuxZuwwO%26export%3Ddownload)

[Draw.io Use Case Diagram](https://drive.google.com/file/d/1JPQv8tZrvDeD9GE1n6V-iyTVIcic6WOF/view?usp=sharing)

## Setup for dev: (NEEDS WORK)
1. Clone entire repo.
2. Run ```npm install``` in the main directory to install all current dependencies.
3. Create a .env file for both the frontend and backend packages
    - Frontend
      ```
          VITE_SERVER_URL=<BACKEND_SERVER>
      ```
    - Backend
      ```
          DB_URL = <MONGO_URL>
      ```
4. VScode Extensions:
    - "JavaScript and TypeScript Nightly"
    - "Prettier - Code formatted"
        1. (CMD/ CTRL) + SHIFT + P
        2. Search "Open User Settings" And Open
        3. Search "Format On Save" And Ensure It is Checked
        4. Search "Default Formatter" And Set It To Prettier Code Formatter
    - "ESLint"
    - "Babel JavaScript"
    - "JavaScript Debugger"
        1. Open Debugger Menu On VS Code
        2. Run The Frontend With ```npm run frontdev```
        3. Click Debug URL
        4. Paste URL For Local Vite Instance (http://localhost:5173/)
        5. Note The Frontend Must Already Be Running To Launch The Debug Window

## Workflow: (NEEDS WORK)
1. Work on your own branch.
2. Pull and resolve conflicts often.

## Scripts:
- ```npm run backdev``` Runs the dev environment for the backend.
- ```npm run frontdev``` Runs the dev environment for the frontend.
- ```npm run test``` Runs jest tests for all workspaces or the current workspace.
- ```npm run format``` Runs the prettier formatter for all files.
- ```npm run lint``` Runs the ESlint for all workspaces.

## Conventional Commits:
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
