import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../const.js';

const createSortTemplate = () => `<ul class="sort">
<li><a href="#" class="sort__button sort__button--active" data-sort-view="${SortType.DEFAULT}">Sort by default</a></li>
<li><a href="#" class="sort__button" data-sort-view="${SortType.BY_DATE}">Sort by date</a></li>
<li><a href="#" class="sort__button" data-sort-view="${SortType.BY_RATIO}">Sort by rating</a></li>
</ul>`;

export default class NewFilterView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return createSortTemplate();
  }
}
