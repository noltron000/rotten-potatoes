const Comment = require('../models/comment')


const controller = (app) => {
	/*********************************************************
		== SHOW INDEX OF ALL COMMENTS ==
		Normally lists out an overview of comments one-by-one.
		However, comments are special because they are
			displayed amongst their associated reviews.
	*********************************************************/
	// nothing to show here!

	/*********************************************************
		== SHOW NEW COMMENT FORM ==
		Normally shows shows the form to createe a new comment.
		It can have a query string that pre-defines the movie.
	*********************************************************/
	// nothing to show here!

	/*********************************************************
		== SHOW ONE COMMENT ==
		Normally Shows a single comment with great detail.
		However, comments are special because they are
			displayed amongst their associated reviews.
	*********************************************************/
	// nothing to show here!

	/*********************************************************
		== FLASH ONE COMMENT ==
		Flashing shows the item without a layout.
	*********************************************************/
	app.get('/comments/:id/flash', async (req, res) => {
		try {
			let comment
			const apiComment = Comment.findById(req.params.id).lean()
			comment = await apiComment

			// Send the markup to the frontend javascript.
			res.render('partials/comment-card', {layout: false, comment})
		}

		catch (err) {
			console.error(err.message)
			res.status(400).send({err})
		}
	})


	/*********************************************************
		== SHOW EDIT REVIEW FORM ==
		Normally this shows the form for updating some comment.
		However, comments are special because they are
			displayed amongst their associated reviews.
	*********************************************************/
	// nothing to show here!


	/*********************************************************
		== SUBMIT A CREATED COMMENT ==
		This controls new comment submissions.
	*********************************************************/
	app.post('/comments', async (req, res) => {
		try {
			let comment = Comment.create(req.body)
			comment = await comment

			res.status(200).send({commentId: comment._id})
		}

		catch (err) {
			console.error(err.message)
			res.status(400).send({err})
		}
	})


	/*********************************************************
		== SUBMIT AN UPDATED MOVIE ==
		This controls comment-edit submissions.

		== TODO ==
		Implement this route.
	*********************************************************/
	// nothing to show here...yet!


	/*********************************************************
		== SUBMIT A COMMENT DELETION ==
		This controls review-deletion submissions.
	*********************************************************/
	app.delete('/comments/:id', async (req, res) => {
		try {
			let comment = Comment.findByIdAndRemove(req.params.id)
			comment = await comment

			if (comment.api_review_id) {
				res.redirect(`/reviews/${comment.api_review_id}?source=api`)
			}
			else if (comment.db_review_id) {
				res.redirect(`/reviews/${comment.db_review_id}?source=db`)
			}
		}

		catch (err) {
			console.error(err.message)
			res.status(400).send({err})
		}
	})
}


module.exports = controller
