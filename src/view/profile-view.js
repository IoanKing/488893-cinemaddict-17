import AbstractView from '../framework/view/abstract-view.js';
import {RankType, RankCount} from '../const.js';

const createProffileTemplate = (rank) => {
  let rankText = '';

  switch (true) {
    case rank <= RankCount.NO_RANK:
      rankText = RankType.NO_RANK;
      break;
    case rank <= RankCount.NOVICE:
      rankText = RankType.NOVICE;
      break;
    case rank <= RankCount.FAN:
      rankText = RankType.FAN;
      break;
    case rank > RankCount.FAN:
      rankText = RankType.MOVIE_BUF;
      break;
  }

  return `<section class="header__profile profile">
  <p class="profile__rating">${(rankText !== '') ? rankText : ''}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class ProffileView extends AbstractView {
  #cardModel = null;

  constructor(cardModel) {
    super();
    this.#cardModel = cardModel;
  }

  get template() {
    return createProffileTemplate(this.rank);
  }

  get rank () {
    const allWatched = this.#cardModel.cards.filter((element) => element.userDetails.isAlreadyWatched);
    return allWatched.length;
  }
}
