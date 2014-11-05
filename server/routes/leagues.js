'use strict';

// Leagues routes use leagues controller
var leagues = require('../controllers/leagues');
var authorization = require('./middlewares/authorization');

// League authorization helpers
var hasAuthorization = function(req, res, next) {
	if (req.league.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

var hasCreatePrivilege = function(req, res, next) {
    // if (req.league.user.id !== req.user.id) {
    //     return;
    // }
    next();
};

module.exports = function(app) {

    app.get('/leagues', leagues.all);
    app.post('/leagues', authorization.requiresLogin, leagues.create);
    app.get('/leagues/:leagueId', leagues.show);
    app.put('/leagues/:leagueId', authorization.requiresLogin, hasAuthorization, leagues.update);
    app.del('/leagues/:leagueId', authorization.requiresLogin, hasAuthorization, leagues.destroy);
    
    // Finish with setting up the leagueId param
    app.param('leagueId', leagues.league);
};