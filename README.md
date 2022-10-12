# Kopeechka Store JS

Wrapper around the [kopeechka.store](https://faq.kopeechka.store/api_page/) email api written with TypeScript for NodeJS and Browser.

The service provides you with real and unique email addresses to receive messages.

# Installation

**npm**

```sh
npm install @sadzurami/kopeechka-store
```

**yarn**

```sh
yarn add @sadzurami/kopeechka-store
```

**CDN**

```
<script src="https://cdn.jsdelivr.net/gh/Sadzurami/kopeechka-store@latest/kopeechka.min.js"></script>
```

# Documentation

## Getting started

```js
import Kopeechka from '@sadzurami/kopeechka-store-js'

const kop = new Kopeechka('<personal access token>')

const start = async () => {
  const address = await kop.getAddress({ website: 'example.com' })
  console.log(address)
  //=> abc@gmail.com
}

start()
```

## Account

### Balance

```js
kop.getBalance().then(console.log)
```

## Address

### Get new email address

Method that gives a Promise returning an email address string.

Arguments: **options** (`object`).

Options may contain the following fields:

- **website** (`string`) - Required. The website for which the address is ordered.
- **domains** (`string` | `string[]`) - Optional. Preferred address domains. Default - random temp domains.
- **filter** (`object`) - Optional. Message **filtering options**.

Filter options may contain the following fields:

- **sender** (`string`) - Optional. Sender of the message.
- **subject** (`string`) - Optional. The subject of the message.

```js
kop
  .getAddress({
    website: 'example.org',
    domains: ['gmail.com', 'yahoo.com'],
    // domains: 'outlook.com,aol.com' - also valid
    filter: {
      sender: 'noreply@example.org',
      subject: 'Please confirm your email'
    }
  })
  .then(console.log)
```

### Reuse address

Method that gives a Promise returning an operation status boolean.

Arguments: **options** (`object`).

Options may contain the following fields:

- **website** (`string`) - Required. The website for which the address is ordered.
- **address** (`string`) - Optional. Earlier received email address. Default - last ordered address on this instance, if it exists.

```js
kop
  .reuseAddress({
    website: 'example.org',
    address: 'abc@gmail.com' // optional
  })
  .then(console.log)
```

### Release address

Method that gives a Promise returning an operation status boolean.

Arguments: **id** (`string`).

- **id** (`string`) - Optional. Task id. Default - id of last ordered address on this instance, if it exists.

```js
kop.releaseAddress('1434984329').then(console.log)
```

## Message

### Receive message

Method that gives a Promise returning a message string.

Arguments: **options** (`object`).

Options may contain the following fields:

- **id** (`string`) - Optional. Task id. Default - id of last ordered address on this instance, if it exists.
- **timeout** (`number`) - Optional. Timeout of message waiting in ms. Default - 120000.
- **delay** (`number`) - Optional. Delay between requests in ms. Default - 10000.

```js
kop
  .getMessage({
    id: '1434984329',
    timeout: 120000,
    delay: 10000
  })
  .then(console.log)
```

## Domain

### List Domains

Method that gives a Promise returning an array of domain objects.

Shortcut of [getPopularDomains](#popular-domains-resource) and [getTempDomains](#temporary-domains-resource) methods with compatibility.

Arguments: **options** (`object`).

Options may contain the following fields:

- **website** (`string`) - Optional. The website for which domains are available.
- **temp** (`boolean`) - Optional. Retrieves temporary domains resource. Dafault - true.
- **popular** (`boolean`) - Optional. Retrieves popular domains resource. Default - true.

```js
kop
  .getDomains({
    website: 'example.org',
    popular: true,
    temp: true
  })
  .then(console.log)
```

### Popular domains resource

Method that gives a Promise returning an array of domain objects.

Arguments: **website** (`string`).

- **website** (`string`) - Optional. The website for which domains are available.

```js
kop.getPopularDomains('example.com').then(console.log)
```

### Temporary domains resource

Method that gives a Promise returning an array of domain strings.

Arguments: **website** (`string`).

- **website** (`string`) - Optional. The website for which domains are available.

```js
kop.getTempDomains('example.com').then(console.log)
```

## Task

### Find the task id

Method that gives a Promise returning an id string.

Arguments: **options** (`object`).

Options may contain the following fields:

- **website** (`string`) - Required. The website for which the address is ordered.
- **address** (`string`) - Required. Earlier received email address.

```js
kop
  .findTaskId({ website: 'example.org', address: 'abc@gmail.com' })
  .then(console.log)
```

### Find tasks

Method that gives a Promise returning an array of task objects.

Arguments: **options** (`object`).

- **website** (`string`) - Required. The website for which the address is ordered.
- **address** (`string`) - Optional. Earlier received email address.
- **comment** (`string`) - Optional. Task comment.
- **limit** (`number`) - Optional. The number of returned tasks. Default - 1.

```js
kop
  .findTasks({
    website: 'example.org',
    address: 'abc@gmail.com',
    comment: 'good',
    limit: 1
  })
  .then(console.log)
```

# Questions And Suggestions

If you have any questions, please contact [service support](https://kopeechka.store/).

If you have any suggestions, please contact me via email [mail.to.sadzurami@gmail.com](mailto:mail.to.sadzurami@gmail.com).
