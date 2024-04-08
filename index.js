#!/usr/bin/env node

const http = require('http');

const myAPIKey = process.env.myAPIKey;

const url = require('url');
const {v4: uuid} = require('uuid');

const database = {
  operations: [
    { id: uuid(), amount: 50 },
    { id: uuid(), amount: 150 },
  ],
};

const getAllOperationsComponent = (operations = []) => {
  let tableRows = operations.map(({ id, amount }, index) => {
    return (`
        <tr>
          <th>${++index}</th>
          <th>${amount}</th>
            <td>
              <a class="btn btn-sm btn-primary" href="/update?id=${id}">обновить</a>
              <a class="btn btn-sm btn-danger" href="/delete?id=${id}">удалить</a>
            </td>
        </tr>
       `)
  }).join('');

  return (`
    <a class="btn btn-primary" href="/create">Добавить запись</a>
    <table class="table table-striped table-sm  mt-3">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th>сумма</th>
          <th>действие</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `)
};

const getFormCreateComponent = () => (`
  <form 
    method="POST"
    action="/create"
  >
  <input
    name="count"
    type="number"
    required
  />
    <button
      class="btn btn-sm btn-success"
      type="submit"
    >
      создать
    </button>
  </form>
`);

const getFormUpdateComponent = ({ id, amount }) => (`
  <form
    method="POST"
    action="/update?id=${id}"
  >
    <input
      name="count" 
      type="number"
      value="${amount}"
    />
    <button
      class="btn btn-sm btn-outline-success" 
      type="submit"
    >
      сохранить
    </button>
  </form>
`);

const layoutStart = (`
  <link
    rel="stylesheet" 
    href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" 
    integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" 
    crossorigin="anonymous"
  />
    <div class="container pt-5">
`);
