---
code: PRJ_002
title: Classificação de milho via satélite
type: Acadêmico · Visão computacional
year: '2020'
role: Projeto Integrador — Fatec
stack: Python · CNN · QGIS
order: 2
layout: article
summary: Identificação de lavouras de milho em imagens do satélite CBERS-3 com deep learning, para classificar quais fazendas têm milho plantado.
cover: ../../assets/projects/satellity-images/banner.jpeg
coverAlt: Plantação de milho
thumb: ../../assets/projects/satellity-images/banner.jpeg
---

## Objetivo

Projeto acadêmico para coletar imagens de satélite de fazendas com a cultura de milho ativa e identificar essa cultura em outras imagens com algoritmos de inteligência artificial — classificando, assim, quais fazendas têm milho plantado.

## Materiais e métodos

Os algoritmos foram desenvolvidos em **Python**, com bibliotecas de deep learning para redes neurais convolucionais (**CNN — Convolutional Neural Network**).

O **QGIS** (sistema de informação geográfica que permite visualizar, editar e analisar dados georreferenciados) foi usado para coletar as bandas espectrais e visualizar os mapas obtidos na base de dados do **INPE** (Instituto Nacional de Pesquisas Espaciais).

A coleta usou o satélite **CBERS-3** com o sensor **MUX** (Câmera Multiespectral Regular), de resolução de 20 metros, com 4 bandas espectrais e mais uma pancromática (na CCD). Com campo de visada de 120 km, ele atende a estudos municipais e regionais, e sua frequência temporal de 26 dias permite analisar fenômenos com duração compatível — resolução que pode ser melhorada pela visada lateral da CCD. As bandas ficam na faixa do visível e do infravermelho próximo, o que gera bom contraste entre a vegetação e outros tipos de objeto.

As imagens passaram pelo tratamento **L4**: imagem ortorretificada, com correção radiométrica e correção geométrica refinada por pontos de controle e por um modelo digital de elevação do terreno.

## Execução

Com os locais das plantações de milho identificados, coletamos as imagens desses milharais em 4 faixas do espectro: azul, verde, vermelho e infravermelho próximo.

![Milharal em RGB](../../assets/projects/satellity-images/milho2.png "RGB")
![Banda vermelha](../../assets/projects/satellity-images/milho2_red.png "Vermelho")
![Banda verde](../../assets/projects/satellity-images/milho2_green.png "Verde")
![Banda azul](../../assets/projects/satellity-images/milho2_blue.png "Azul")
![Banda de infravermelho próximo](../../assets/projects/satellity-images/milho2_nir.png "Infravermelho próximo")

Em seguida, as imagens foram divididas em fragmentos para o treinamento da rede de deep learning. Como a coleta e a limpeza dos dados são decisivas para o resultado, dedicamos boa parte do tempo a esses algoritmos, buscando uma taxa de acurácia satisfatória.

## Caminhos futuros

Uma evolução possível é combinar as imagens com o **NDVI** de cada região, usando softwares e bases como o **SATVeg** para obter o histórico de NDVI de cada ponto do mapa:

![Mapa de NDVI da região do milharal](../../assets/projects/satellity-images/maize_map_NDVI.png "Mapa de NDVI")
![Gráfico do histórico de NDVI](../../assets/projects/satellity-images/maize_graph_ndvi.png "Histórico de NDVI (SATVeg)")

Isso permitiria criar uma nova feature de classificação baseada em NDVI.
