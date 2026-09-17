# Web-Doom

The Ultimate Doom (1995) no navegador, via js-dos v3 (DOSBox em asm.js).

## Internet Explorer 11

O alvo e o IE11, inclusive com user-agent de compatibilidade:

`Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.2; WOW64; Trident/7.0; ...)`

Isso e **IE11 (Trident/7)** fingindo IE7. A pagina manda `X-UA-Compatible: IE=11` para subir o `documentMode` para 11. Sem isso nao ha canvas utilizavel nem typed arrays.

O que funciona nesse IE:

- Render em canvas 2D / asm.js (sem WebAssembly)
- Teclado e o ZIP do DOOM via `XMLHttpRequest` + `arraybuffer`

O que nao existe no IE11:

- Web Audio — o jogo sobe **mudo**
- `overrideMimeType` — o loader antigo quebrava; agora usa `arraybuffer`

## Como abrir

Sirva a pasta por HTTP (o IE bloqueia ZIP em `file://`):

```
python -m http.server 8000
```

Se a faixa vermelha disser `documentMode 7`, desligue a Vista de Compatibilidade / Enterprise Mode para este site e recarregue.

Nao e preciso recompilar o DOSBox: `vendor/js-dos-v3.js` ja e o asm.js do js-dos v3. Recompilar so faria sentido com Emscripten antigo (`WASM=0`) se esse JS for trocado.
