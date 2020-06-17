const express = require('express');

const app = express();

// tell express to get json from request body
app.use(express.json());

// our fake db
const projects = [
    { id: 1, name: "GoStack" },
    { id: 2, name: "GoHarder" },
    { id: 3, name: "GoHome" }
];
let lastId = 4;

// our middleware
function myMiddleware (request, response, next) {
    const { method, url } = request;
    const logLabel = `[${method.toUpperCase()}] ${url}`;
    console.log(logLabel);
    next(); // allow the request
}
// app.use(myMiddleware);

app.get('/projects', myMiddleware, (request, response) => {
    const { name } = request.query; // query params
    const results = name ? projects.filter(o => o.name.includes(name)) : projects;
    return response.json(results);
});

app.post('/projects', (request, response) => {
    const { body } = request;
    console.log("body: ", body);

    const newProject = {
        id: lastId,
        ...body
    };
    projects.push(newProject);
    lastId++;
    return response.json(projects);
});

app.put('/projects/:id', (request, response) => {
    const { params, body } = request; // route params
    console.log("params: ", params);
    console.log("body: ", body);

    const projectIndex = projects.findIndex(o => o.id == params.id);
    if (projectIndex >= 0) {
        const project = {
            id: params.id,
            ...body    
        };
        projects[projectIndex] = project;
        return response.json(projects);
    } else {
        return response.status(400).json({
            error: "Project not found"
        });
    }
});

app.delete('/projects/:id', (request, response) => {
    const { params } = request; // route params
    console.log("params: ", params);

    const projectIndex = projects.findIndex(o => o.id == params.id);
    if (projectIndex >= 0) {
        projects.splice(projectIndex, 1);
        return response.status(204).send();
    } else {
        return response.status(400).json({
            error: "Project not found"
        });
    }
});

app.listen(3333, () => {
    console.log('☢ Backend started!')
});