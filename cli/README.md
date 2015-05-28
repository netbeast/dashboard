# xway node.js package
Command line tool to pop different nodejs directory trees compatible with xway (learn more at http://netbeast.co).

Install
```bash
npm install -g xway
```

Create an app:
```bash
xway new myapp
```

Remove:
```bash
xway rm myapp
```

Convert to .tar.gz, an open format accepted by xway to publish an app
```bash
xway pkg myapp
```

Package your current directory
```bash
xway pkg .
```

Extracts in a specific path
```bash
xway unpkg myapp --to /path/to/dir # Will decompress it :)
```

To prompt help you can always:
```bash
xway --help
```

Piece of cake!<br/>
Want to collaborate, fork or modify? Do it. Anything else, reach me at jesus@netbeast.co :]
