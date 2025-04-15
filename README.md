# 308-Project
### Team
- Paul Motter
- Tyler Pham
- Josh Cavender
- David Veronov
 
# Workout In Progress
Workout In Progress is a workout tracking application. It helps keep track of when and what workouts you have completed, provides statistics on what has been completed, and provides tools for easily inputting workouts. Our goal is to create an app that eliminates a lot of the extra and unnecessary features that most workout apps provide. Trim down these elements into the core functionality that is easy and efficient to use.

## Tech Spec Document
[Tech Spec Doc](https://docs.google.com/document/d/1pv5Od8G1ek-ETLHgJwQMxAxre_nD8fRDjutjLOnxXK0/edit?usp=sharing)

## Figma Prototype
[Figma Project](https://www.figma.com/design/40heWTG7s883OhvNfuJlLm/pmotter's-team-library?node-id=0-1&t=s2ZUUt3js5H2pfjs-1)

[Figma Prototype Demo](https://www.figma.com/proto/40heWTG7s883OhvNfuJlLm/pmotter's-team-library?node-id=3317-2&p=f&t=qPZslnocKgtIEETe-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=3317%3A2)

## UML Diagrams
[UML Class Diagram](https://drive.google.com/file/d/1ltDPBsD1gQQ0TONN-j8DJo3RjuxZuwwO/view?usp=sharing)

[UML Use Case Diagram](https://drive.google.com/file/d/13Lz_-dlQdHMw1UA3KrU9TH2LY3W08dgx/view?usp=sharing)

[UML Activity Diagram](https://drive.google.com/file/d/1RCC0hqDVSrnWCDgpppQ3kv7xycMe5lVk/view?usp=sharing)

## Test Coverage Report
Date: 4/15/2025 10pm 

Backend Report: <br />
<img width="682" alt="Screenshot 2025-04-15 at 10 12 30 AM" src="https://github.com/user-attachments/assets/71fcea2f-f769-4e50-9cc7-728e69995fd4" />

1. In memory-database tests <br />
<img width="237" alt="Screenshot 2025-04-15 at 10 17 49 AM" src="https://github.com/user-attachments/assets/a8102b44-051b-403d-bf70-9b6e118166dc" />

3. Mock test <br />
<img width="263" alt="Screenshot 2025-04-15 at 10 16 28 AM" src="https://github.com/user-attachments/assets/2366c931-37ab-4a45-9115-0fa978047228" />



## Setup for dev
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
    - "Tailwind CSS IntelliSense" This will add autocomplete to tailwind CSS classNames.
       1. Open VScode settings to "file association" and add the item "*css" and value "tailwindcss". 
       2. Open VScode settings to "editor quick suggestions" and change strings to on.

## Scripts
- ```npm run backdev``` Runs the dev environment for the backend.
- ```npm run frontdev``` Runs the dev environment for the frontend.
- ```npm run test``` Runs jest tests for all workspaces or the current workspace.
- ```npm run coverage``` Runs jest tests with coverage report for all workspaces or the current workspace.
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
