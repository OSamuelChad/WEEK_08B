const express = require('express')
const Ajv = require('ajv')
const addFormats = require('ajv-formats')
const ajv = new Ajv()
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./openapi.yaml');


const app = express()
app.use(express.json())
const port = 3000
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
addFormats(ajv)

let id = 0

const users = []

const userSchema = {
    type: "object",
    properties: {
      name: {type: "string"},
      email: {type: "string", format: "email"},
      password: {type: "string"}
    },
    required: ["name", "email", "password"],
    additionalProperties: false
}

const validateUser = (req, res, next) => {
    const user = req.body
    const validate = ajv.compile(userSchema)
    const valid = validate(user)
    if (valid) {
        next()
    } else {
        res.status(400).json({ msg: "Dados inválidos", errors: validate.errors })
    }
}

app.get('/users', (req, res) => {
    res.json({users: users})
})

app.post('/users', validateUser, (req, res) => {
    const user = req.body
    user.id = ++id
    users.push(user)
    res.json({msg: "Usuário adicionado com sucesso."})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})