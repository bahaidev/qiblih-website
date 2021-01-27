'use strict';

module.exports = {
  reject: [
    // Todo[bootstrap@>5.0.0-beta1]: beta1 wasn't at https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-beta1/css/bootstrap.min.css
    // Even 4.5.3 wasn't on the CDN

    // Lock in any npm packages here
    // Todo[bootstrap@>4.5.2]: If we update the bootstrap version, should also
    //  look at possible new dependencies (e.g., popper now @popperjs/core)
    //  see https://github.com/twbs/bootstrap/blob/master/config.yml
    'bootstrap'
  ]
};
