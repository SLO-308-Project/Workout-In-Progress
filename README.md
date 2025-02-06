# 308-Project

# Workout In Progress
Product Vision: A workout logger for tracking workouts and viewing past workouts.

## Figma Prototype
[Figma Project](https://www.figma.com/design/40heWTG7s883OhvNfuJlLm/pmotter's-team-library?node-id=0-1&t=s2ZUUt3js5H2pfjs-1)

[Figma Prototype Demo](https://www.figma.com/proto/40heWTG7s883OhvNfuJlLm/pmotter's-team-library?node-id=3317-2&p=f&t=qPZslnocKgtIEETe-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=3317%3A2)

## UML Diagram
[Draw.io UML Diagram](https://drive.google.com/file/d/1ltDPBsD1gQQ0TONN-j8DJo3RjuxZuwwO/view?usp=sharing)

## Setup for dev: (NEEDS WORK)
1. Clone entire repo.
2. Run npm init.
3. VScode Extensions:
    - "JavaScript and TypeScript Nightly"
    - "Prettier - Code formatted"

## Workflow: (NEEDS WORK)
1. Work on your own branch.
2. Pull and resolve conflicts often.
3. 

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
