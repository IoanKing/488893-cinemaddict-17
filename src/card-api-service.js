import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class CardsApiService extends ApiService {
  get cards() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateTask = async (movie) => {
    const response = await this._load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  getComments = async (movie) => await this._load({url: `comments/${movie.id}`})
    .then(ApiService.parseResponse);

  #adaptToServer = (movie) => {
    const adaptedCard = {...movie,
      'id': movie.id,
      'comments': movie.comments,
      'film_info': {
        'title': movie.filmInfo.title,
        'alternative_title': movie.filmInfo.alternativeTitle,
        'total_rating': movie.filmInfo.totalRating,
        'poster': movie.filmInfo.poster,
        'age_rating': movie.filmInfo.ageRating,
        'director': movie.filmInfo.director,
        'writers': movie.filmInfo.writers,
        'actors': movie.filmInfo.actors,
        'release': {
          'date':  movie.filmInfo.release.date,
          'release_country': movie.filmInfo.release.releaseCountry
        },
        'runtime': movie.filmInfo.runtime,
        'genre': movie.filmInfo.genre,
        'description': movie.filmInfo.description,
        'user_details': {
          'watchlist': movie.userDetails.watchlist,
          'already_watched': movie.userDetails.isAlreadyWatched,
          'watching_date': movie.userDetails.watchingDate instanceof Date ? movie.userDetails.watchingDate.toISOString() : null,
          'favorite': movie.userDetails.favorite
        },
      }
    };

    delete adaptedCard.userDetails;
    delete adaptedCard.filmInfo;

    return adaptedCard;
  };
}
