import AbstractView from '../framework/view/abstract-view.js';

const createProffileTemplate = (rank) => {
  let rankText = '';

  switch (true) {
    case rank < 1:
      rankText = '';
      break;
    case rank <= 10:
      rankText = 'novice';
      break;
    case rank <= 20:
      rankText = 'fan';
      break;
    case rank > 21:
      rankText = 'movie buff';
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
