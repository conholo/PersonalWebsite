exports.get_projects_page = (req, res) => {
    return res.render('projects.html');
}

exports.get_pathfinder_page = (req, res) => {
    return res.render('pathfinder.html');
}

exports.get_2D_engine_page = (req, res) => {
    return res.render('2D_engine.html')
}