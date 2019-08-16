import _ from 'lodash';
import cheerio from 'cheerio';
import axios from 'axios';
import { trimMultiple, trim } from '@berkozturk/trim_character';

let instance = null;
class IMDBTop200 {
  constructor() {
    this.url = 'https://www.imdb.com/list/ls051781075/';
    this.secondPageUrl = 'https://www.imdb.com/list/ls051781075/?page=2';
    this.rowSelector = '.lister-item.mode-detail';
    this.headerSelector = '.lister-item-header';
    this.contentSelector = '.lister-item-content';
    this.indexSelector = `${this.headerSelector} .lister-item-index`;
    this.yearSelector = `${this.headerSelector} .lister-item-year`;
    this.runtimeSelector = `${this.contentSelector} .runtime`;
    this.genreSelector = `${this.contentSelector} .genre`;
    this.descriptionSelector = `${this.contentSelector} p:nth-child(5)`;
    this.imageURLSelector = '.lister-item-image img';
    this.ratingSelector = '.ipl-rating-star.small > span.ipl-rating-star__rating';
    this.metaScoreSelector = '.ratings-metascore > span';
  }

  static getInstance() {
    if (!instance) {
      instance = new IMDBTop200();
    }
    return instance;
  }

  async get() {
    const top200 = [];
    const firstPageResponse = await IMDBTop200.getHtml(this.url);
    top200.push(this.parseHtml(firstPageResponse));
    const secondPageResponse = await IMDBTop200.getHtml(this.secondPageUrl);
    top200.push(this.parseHtml(secondPageResponse));
    return top200;
  }

  static async getHtml(url) {
    const response = await axios.get(url);
    return response.data;
  }

  parseHtml(html) {
    const $ = cheerio.load(html);
    const movies = _.map($(this.rowSelector), (item) => this.parseRow(item));
    return movies;
  }

  parseRow(html) {
    const $row = cheerio.load(html);
    return {
      index: $row(this.indexSelector).text().replace('.', ''),
      title: $row(`${this.headerSelector} a`).text(),
      year: trimMultiple($row(this.yearSelector).text(), ')', '('),
      runtime: $row(this.runtimeSelector).text(),
      genre: trim($row(this.genreSelector).text(), ' '),
      description: trim($row(this.descriptionSelector).text(), ' '),
      image: $row(this.imageURLSelector).attr('src'),
      id: $row(this.imageURLSelector).data('tconst'),
      rating: $row(this.ratingSelector).text(),
      metaScore: trim($row(this.metaScoreSelector).text(), ' '),
    };
  }
}

export default IMDBTop200.getInstance();
