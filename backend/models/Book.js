  const mongoose = require("mongoose");

  const reviewSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      userName: {
        type: String,
        required: true,
        trim: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
    { _id: false }
  ); // Don't create _id for subdocuments

  const bookSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: [true, "Book title is required"],
        trim: true,
        maxlength: [200, "Title cannot exceed 200 characters"],
        index: true,
      },
      author: {
        type: String,
        required: [true, "Author name is required"],
        trim: true,
        index: true,
      },
      price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"],
      },
      image: {
        type: String,
        required: [true, "Book image URL is required"],
      },
      description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
        maxlength: 2000,
      },
      category: {
        type: String,
        required: [true, "Category is required"],
        enum: {
          values: [
            "Fiction",
            "Self-Help",
            "Science",
            "Mystery",
            "Fantasy",
            "Biography",
            "History",
            "Science Fiction",
            "Romance",
            "Thriller",
            "Business",
            "Other",
          ],
          message: "{VALUE} is not a valid category",
        },
        index: true,
      },
      stock: {
        type: Number,
        required: [true, "Stock quantity is required"],
        min: [0, "Stock cannot be negative"],
        default: 0,
      },
      rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },

      reviews: [reviewSchema],
      publishedDate: { type: Date, required: true },
        featured: {    
          type: Boolean,
          default: false,
          index: true
        }
      },
    {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
    },

    
  );

  // ✅ Text index for search (MUST be defined before model compilation)
  bookSchema.index({ title: "text", author: "text", description: "text" });

  // Virtual for review count
  bookSchema.virtual("reviewCount").get(function () {
    return this.reviews?.length || 0;
  });

  // ✅ Static method to calculate average rating (avoids middleware loops)
  bookSchema.statics.calculateAverageRating = async function (bookId) {
    const result = await this.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(bookId) } },
      { $unwind: "$reviews" },
      { $group: { _id: "$_id", averageRating: { $avg: "$reviews.rating" } } },
    ]);

    if (result.length > 0) {
      await this.findByIdAndUpdate(bookId, {
        rating: parseFloat(result[0].averageRating.toFixed(1)),
      });
    } else {
      await this.findByIdAndUpdate(bookId, { rating: 0 });
    }
  };

  // ✅ Post middleware to update rating after review changes
  bookSchema.post("save", async function () {
    // Only update rating if reviews array was modified
    if (this.isModified("reviews")) {
      await this.constructor.calculateAverageRating(this._id);
    }
  });

  module.exports = mongoose.model("Book", bookSchema);
