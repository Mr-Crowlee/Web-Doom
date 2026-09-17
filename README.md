# Web-Doom

The Ultimate Doom (1995) no navegador, via js-dos v3 (DOSBox em asm.js).

## Internet Explorer 11

O alvo é o IE11, inclusive com user-agent de compatibilidade:

`Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.2; WOW64; Trident/7.0; ...)`

Isso é **IE11 (Trident/7)** fingindo IE7. A página manda `X-UA-Compatible: IE=11` para subir o `documentMode` para 11. Sem isso não há canvas utilizável nem typed arrays.

O que funciona nesse IE:

- Render em canvas 2D / asm.js (sem WebAssembly)
- Teclado e o ZIP do DOOM via `XMLHttpRequest` + `arraybuffer`

O que não existe no IE11:

- Web Audio — o jogo sobe **mudo**
- `overrideMimeType` — o loader antigo quebrava; agora usa `arraybuffer`

## Como abrir

Sirva a pasta por HTTP (o IE bloqueia ZIP em `file://`):

```
python -m http.server 8000
```

Se a faixa vermelha disser `documentMode 7`, desligue a Vista de Compatibilidade / Enterprise Mode para este site e recarregue.

Não é necessário recompilar o DOSBox: `vendor/js-dos-v3.js` já é o asm.js do js-dos v3. Recompile só se trocar o binário do Emscripten (`WASM=0`).
