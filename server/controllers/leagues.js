'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    League = mongoose.model('League'),
    _ = require('lodash');


/**
 * Find league by id
 */
exports.league = function(req, res, next, id) {
    League.load(id, function(err, league) {
        if (err) return next(err);
        if (!league) return next(new Error('Failed to load league ' + id));
        req.league = league;
        next();
    });
};

/**
 * Create a league
 */
exports.create = function(req, res) {
    var league = new League(req.body);
    league.user = req.user;

    league.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                league: league
            });
        } else {
            res.jsonp(league);
        }
    });
};

/**
 * Update a league
 */
exports.update = function(req, res) {
    var league = req.league;

    league = _.extend(league, req.body);

    league.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                league: league
            });
        } else {
            res.jsonp(league);
        }
    });
};

/**
 * Delete a league
 */
exports.destroy = function(req, res) {
    var league = req.league;

    league.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                league: league
            });
        } else {
            res.jsonp(league);
        }
    });
};

/**
 * Show a league
 */
exports.show = function(req, res) {
    console.log('show');
    res.jsonp(req.league);
};

/**
 * List of Leagues
 */
exports.all = function(req, res) {
    League.find().sort('-created').populate('user', 'name username').exec(function(err, leagues) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(leagues);
        }
    });
};