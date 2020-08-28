import Request from 'models/request';

const WORDPRESS_HOST = process.env.WORDPRESS_HOST;
const WORDPRESS_BASE_PATH = '/wp-json';

class WpRequest extends Request {
  constructor({ route = '' } = {}) {
    super();
    this.route = route;
  }

  get url() {
    return `${WORDPRESS_HOST}${WORDPRESS_BASE_PATH}${this.route}`;
  }
}

export default WpRequest;