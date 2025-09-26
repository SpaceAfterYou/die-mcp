[![Stand With Ukraine](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner-direct-single.svg)](https://stand-with-ukraine.pp.ua)

# Detect It Easy [model context protocol]

## Environment file example ✉️

```ini
DIE_PATH = C:/diec.exe
DEBUG = true
TIMEOUT = 30000
```

## Configuration Example 📝

```json
{
  "mcpServers": {
    "detect-it-easy": {
      "type": "stdio",
      "command": "bun",
      "args": [
        "run",
        "A:/sources/die-mcp/app/index.ts"
      ],
      "env": {
        "NODE_ENV": "production",
        "DIE_PATH": "A:/apps/die_win32_portable/diec.exe"
      }
    }
  }
}
```

## Chat 🙋

Wanna chat with us, talk about changes, or just hang out? ~~We~~(I'm) have a Discord server just for that.

[![!](https://invidget.switchblade.xyz/SequFJP)](http://discord.gg/SequFJP)
