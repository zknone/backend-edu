#!/usr/bin/env node

const http = require('http');

const myAPIKey = process.env.myAPIKey;

const url = require('url');
const {v4: uuid} = require('uuid');

const database = {
  operations: [
    {id: uuid(), amount: 50},
    {id: uuid(), amount: 150},
  ]
}

const getAllOperationsComponent = (operations = []) => {
  let tableRows = operations.map(({id, amount}, index) => {
    return(`
      <tr>
        <th>${++index}</th>
        <th>${amount}</th>
        <td>
          <a class="btn btn-sm brn-primary" href="/update?id=${id}">обновить</a>
          <a class="btn btn-sm brn-danger" href="/delete?id=${id}">удалить</a>
        </td>
      </tr>
    `)
  }).join('');

  return (`
  <a class="btn btn-sm brn-primary" href="/create">Добавить запись</a>
  <table class="table table-striped table-sm mt-3">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th>Сумма</th>
        <th>Действие</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>
  `)
}


const getFormCreateComponent = () => {
  return (`
    <form method="POST" action="/create">
      <input name="count" type="number" required />
      <button class="btn btn-sm btn-success" type="submit">Создать</button>
    </form>
  `)

}