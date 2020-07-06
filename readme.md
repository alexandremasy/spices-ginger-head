# Ginger Head Plugin

Allows the alteration of the HTML header directly from the ginger views. 
e.g. Change the title of the document based on dynamically loaded data


## Setup

1. Install the plugin

```
yarn add @ginger/head
```

2. Declare the plugin

```
import { GingerHeadPlugin } from '@ginger/head'

let opts = {
  key: 'ABC'
}

app.use(VueGinger, {
  plugins: [{ optins: opts, plugin: GingerHeadPlugin }]
})
```

## Configuration

