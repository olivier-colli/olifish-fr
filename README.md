# olifish-fr

Site d'Olivier Colli  photographe passionné par la plongée sous-marine

## Ajouter une gallerie

## Sous le capot

### Comment sont construite les galeries ?

Elles sont générées par scripts qui fabriquent des pages pour chaque galerie présentent dans le fichier _./galleries.yml_  
  
Les galeries sont stockées dans le dossier : _/galeries_  (traduite pour chaque pays)

## Génération de la home

Le script *cli/createHome.js* prends en charge la composition de la home page.

Le bloc des galleries est composé à partir du fichier *config.json*.

Exemple de contenu du fichier *config.json*
```bash
[
  {
    "title": "Coraya baie mai 2017",
    "description": "Égypte",
    "img": "57.jpg"
  },
  {
    "title": "Lanzarote",
    "description": "Les îles Canaries",
    "img": "24.jpg"
  }
]
```

À partir de ces données le script compose le html :

```html
<figure class=img>
    <a href=# class=gallery>
        <img src=./light-thumbs/thumb-24.jpg alt=Lanzarote>
    </a>
    <figcaption itemprop="caption description">Les îles Canaries</figcaption>
    <h3>Lanzarote</h3>
</figure>
<figure class=img>
    <a href=# class=gallery>
        <img src=./light-thumbs/thumb-57.jpg alt="Coraya baie mai 2017">
    </a>
    <figcaption itemprop="caption description">Égypte</figcaption>
    <h3>Coraya baie mai 2017</h3>
</figure>
```

## Pour les mise à jour :

### Changer le nom des galleries pour l'adapter à chaque traduction


- dans cli/template/tpl-script.js : 

```javascript
    document.location.href = `/galeries/#${slugify(query)}`
```
