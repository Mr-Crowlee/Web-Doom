# Web-Doom

The Ultimate Doom (1995) no navegador, via js-dos v3 (DOSBox em asm.js), pensado para **IE11**.

## Por que o IE11 trava

O user-agent `MSIE 7.0; Trident/7.0` é IE11 em vista de compatibilidade. O Chakra **não acelera asm.js** e ainda assim precisa parsear **uma função de ~5 MB** (`vendor/js-dos-v3.js`) na thread da UI, além de alocar o heap do Emscripten.

Isso não é “download lento”: a aba congela na **compilação**. Não dá para fatiar essa função sem recompilar o DOSBox.

## O que já fizemos (sem recompilar)

- Prefetch do JS e do ZIP **antes** do clique, com progresso no overlay
- Heap de **64 MB** em vez de 128 MB
- Um `setTimeout` para a mensagem “vai congelar” pintar **antes** da compilação
- Cópia do ZIP para o HEAP em pedaços de 256 KB (o `extract_zip` em C ainda é um bloco só)
- `serve.py` / `web.config`: gzip + `X-UA-Compatible: IE=11` + cache
- Depois do `HU_Init`, o DOSBox ia a `cycles=max` no loop gráfico e o IE parava de responder. Agora grava `dosbox-SVN.conf` com `cycles=10000` (antes 3000, o jogo ficava em câmara lenta e os comandos atrasavam), `nosound=true` e o canvas recusa WebGL. Setas não rolam a página. `?cycles=8000` se travar; Ctrl+F12 / Ctrl+F11 no jogo.

A segunda visita, com JS em cache, costuma ser bem melhor. O jogo fica mais lento (CPU capado) para a aba continuar viva.

## Como abrir

```
python serve.py
```

Abra `http://127.0.0.1:8000/`. Espere “Download pronto”, depois clique. Na primeira compilação o IE pode ficar 30–90s sem responder — não feche a aba.

Jogo **mudo** (IE11 não tem Web Audio).

## O que recompilar mudaria (próximo passo, se ainda travar)

Só um binário menor muda o tempo de parse de verdade:

1. **doomgeneric / Chocolate Doom** no Emscripten antigo (`WASM=0`, canvas 2D) — sem emular um PC inteiro; JS bem menor.
2. DOSBox com `--proxy-to-worker` — o parse iria para um Worker (IE11 tem Worker; não tem OffscreenCanvas, o Emscripten proxy manda o framebuffer por `postMessage`).
3. Emterpreter (`dosbox-emterp`) — arranque às vezes menos brutal, runtime mais lento.

Enquanto o motor for o DOSBox asm.js de 5 MB, o freeze da primeira compilação no Chakra é esperado.
