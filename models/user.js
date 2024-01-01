const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, "Minimum password length is 6 characters"]
  },
  admin: {
    type: Boolean,
    default: false
  },
  decks: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
        unique: true
      },
      description: String,
      category: {
        type: String,
        default: 'uncategorized'
      },
      date_created: {
        type: Date,
        default: Date.now
      },
      rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      cards: [
        {
          front_text: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            message: 'Card front text must be unique',
            },
          back_text: {
            type: String
          },
          front_img: {
            type: String
          },
          back_img: {
            type: String
          },
          tag: {
            type: String,
            default: 'all'
          },
          date_created: {
            type: Date,
            default: Date.now
          },
          rating: {
            type: Number,
            enum: [1, 2, 3, 4, 5],
            default: 1,
          },
        }
      ]
    }
  ],
  tags:  {
    type: [String],
    default: ['all']
  },
  categories: {
    type: [String],
    default: ['uncategorized']
  }
});


userSchema.pre('save',  async function (next) {
 const salt = await bcrypt.genSalt();
 this.password = await bcrypt.hash(this.password, salt)
 next();
 })
userSchema.statics.login = async function (email, password) {
 const user = await this.findOne({ email });
 if (user) {
  const auth = await bcrypt.compare(password, user.password);
  if (auth) {
   return user;
  }
  throw Error('incorrect password');
 }
 throw Error('incorrect email');
}

//decks
userSchema.post('validate', function (error, doc, next) {
  if (error.errors['decks.name'] && error.errors['decks.name'].kind === 'unique') {
    doc.invalidate('decks', 'Deck name must be unique');
  }
  if (error.errors['decks.cards.text_front'] && error.errors['decks.cards.text_front'].kind === 'unique') {
    doc.invalidate('decks.cards', 'Card front text must be unique');
  }

  next();
})

userSchema.statics.getCategories = async function () {
  const res = await this.findOne({}, { categories: 1 }).exec();
  console.log("res", res);
  const categoriesArray = res ? res.categories : [];
  console.log("categoriesArray", categoriesArray);
  return categoriesArray;
}

userSchema.statics.addCategory = async function (category) {
  try {
    // Update all documents to add the new category
    const result = await this.updateMany({}, { $addToSet: { categories: category } });
    console.log(`Added category "${category}" to all documents. Modified ${result.nModified} documents.`);
  } catch (error) {
    console.error('Error adding category to all documents:', error.message);
    throw error;
  }
};

userSchema.statics.getTags = async function () {
  const res = await this.findOne({}, { tags: 1 }).exec();
  console.log("res", res);
  const tagsArray = res ? res.tags : [];
  console.log("categoriesArray", tagsArray);
  return tagsArray;
}


userSchema.statics.addTag = async function (tag) {
  try {
    // Update all documents to add the new category
    const result = await this.updateMany({}, { $addToSet: { tags:tag} });
    console.log(`Added tag "${tag}" to all documents. Modified ${result.nModified} documents.`);
  } catch (error) {
    console.error('Error adding tag to all documents:', error.message);
    throw error;
  }
};


userSchema.statics.createDeck = async function (email, deck_name, description,category) {
  try {
    const user = await this.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    const newDeck = {
      name:deck_name,
      description:description,
      date_created: Date.now(),
      rating: 1, // Default rating
      category:category,
      cards: [], // Empty cards array
    };

    user.decks.push(newDeck);
    await user.save();

    return newDeck;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.editDeck = async function (email, deck_name, new_deck_name, category, description) {
  try {
    const user = await this.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    // Find the index of the deck with the given deck_name
    const deckIndex = user.decks.findIndex((deck) => deck.deck_name === deck_name);

    if (deckIndex === -1) {
      throw new Error('Deck not found');
    }

    // Update the deck fields based on provided parameters
    if (new_deck_name) {
      user.decks[deckIndex].deck_name = new_deck_name;
    }

    if (category) {
      user.decks[deckIndex].category = category;
    }

    if (description) {
      user.decks[deckIndex].description = description;
    }

    // Save the updated user document
    await user.save();

    return { success: true, message: 'Deck edited successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

userSchema.statics.deleteDeck = async function (email, deck_name) {
  try {
    const user = await this.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    // Find the index of the deck with the given deck_name
    const deckIndex = user.decks.findIndex((deck) => deck.deck_name === deck_name);

    if (deckIndex === -1) {
      throw new Error('Deck not found');
    }

    // Remove the deck from the decks array
    user.decks.splice(deckIndex, 1);

    // Save the updated user document
    await user.save();

    return { success: true, message: 'Deck deleted successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

userSchema.statics.saveDeck = async function (deck_name, deck_owner, email) {
  try {
    // Find the user who owns the original deck
    const deckOwner = await this.findOne({ email: deck_owner });
    if (!deckOwner) {
      throw new Error('Deck owner not found');
    }

    // Find the index of the deck with the given deck_name
    const originalDeckIndex = deckOwner.decks.findIndex((deck) => deck.deck_name === deck_name);

    if (originalDeckIndex === -1) {
      throw new Error('Deck not found');
    }

    // Get the original deck
    const originalDeck = deckOwner.decks[originalDeckIndex];

    // Create a copy of the original deck
    const copiedDeck = { ...originalDeck.toObject(), _id: mongoose.Types.ObjectId() };

    // Find the current user
    const user = await this.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    // Insert the copied deck into the current user's document
    user.decks.push(copiedDeck);

    // Save the updated user document
    await user.save();

    return { success: true, message: 'Deck saved successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

//cards

userSchema.statics.createCard = async function (email, deck_name, front_text, tag, back_text = null, front_img = null, back_img = null) {
  try {
    const user = await this.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    // Find the index of the deck with the given deck_name
    const deckIndex = user.decks.findIndex((deck) => deck.deck_name === deck_name);

    if (deckIndex === -1) {
      throw new Error('Deck not found');
    }

    // Create the new card
    const newCard = {
      front_text,
      tag,
      date_created: Date.now(),
      rating: 1, // Default rating
    };

    // Add optional parameters if provided
    if (back_text !== null) {
      newCard.back_text = back_text;
    }

    if (front_img !== null) {
      newCard.front_img = front_img;
    }

    if (back_img !== null) {
      newCard.back_img = back_img;
    }

    // Add the new card to the deck
    user.decks[deckIndex].cards.push(newCard);

    // Save the updated user document
    await user.save();

    return newCard;

  } catch (error) {
    throw error;
  }
};


userSchema.statics.editCard = async function (email, deck_name, front_text, back_text, front_img, back_img, tag) {
  try {
      
    const user = await this.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    // Find the index of the deck with the given deck_name
    const deckIndex = user.decks.findIndex((deck) => deck.deck_name === deck_name);

    if (deckIndex === -1) {
      throw new Error('Deck not found');
    }

    // Find the index of the card with the given front_text
    const cardIndex = user.decks[deckIndex].cards.findIndex((card) => card.front_text === front_text);

    if (cardIndex === -1) {
      throw new Error('Card not found');
    }

    // Update the card fields based on provided parameters
    if (back_text) {
      user.decks[deckIndex].cards[cardIndex].back_text = back_text;
    }

    if (front_img) {
      user.decks[deckIndex].cards[cardIndex].front_img = front_img;
    }

    if (back_img) {
      user.decks[deckIndex].cards[cardIndex].back_img = back_img;
    }

    if (tag) {
      user.decks[deckIndex].cards[cardIndex].tag = tag;
    }

    // Save the updated user document
    await user.save();

    return { success: true, message: 'Card edited successfully' };

  }
  catch (error) {
    throw error;
  }
};

userSchema.statics.deleteCard = async function (email, deck_name, front_text) {
  try {
    const user = await this.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    // Find the index of the deck with the given deck_name
    const deckIndex = user.decks.findIndex((deck) => deck.deck_name === deck_name);

    if (deckIndex === -1) {
      throw new Error('Deck not found');
    }

    // Find the index of the card with the given front_text
    const cardIndex = user.decks[deckIndex].cards.findIndex((card) => card.front_text === front_text);

    if (cardIndex === -1) {
      throw new Error('Card not found');
    }

    // Remove the card from the cards array
    user.decks[deckIndex].cards.splice(cardIndex, 1);

    // Save the updated user document
    await user.save();

    return { success: true, message: 'Card deleted successfully' };

  } catch (error) {
    return { success: false, message: error.message };
  }
}



userSchema.statics.getAllDecksWithAllCards = async function () {
  try {
    const usersWithDecks = await this.find({}).populate({
      path: 'decks.cards',
      select: 'card_name front_text back_text front_img back_img date_created rating tag',
    });

    const formattedDecks = usersWithDecks.reduce((result, user) => {
      user.decks.forEach((deck) => {
        const formattedDeck = {
          user: { name: user.name, email: user.email },
          deck: {
            deck_name: deck.name,
            date_created: deck.date_created,
            description: deck.description,
            rating: deck.rating,
            cards: deck.cards,
          },
        };
        result.push(formattedDeck);
      });
      return result;
    }, []);

    // Sort decks by highest rating
    const sortedDecks = formattedDecks.sort((a, b) => b.deck.rating - a.deck.rating);

    return sortedDecks;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.getAllDecksofOneUser = async function (email) {
  try {
    const usersWithDecks = await this.find({ email: email }).populate({
      path: 'decks.cards', // Ensure this path matches your schema
      select: 'card_name front_text back_text front_img back_img date_created rating tag',
    });

    const formattedDecks = usersWithDecks.reduce((result, user) => {
      user.decks.forEach((deck) => {
        const formattedDeck = {
          user: { name: user.name, email: user.email },
          deck: {
            deck_name: deck.name,
            date_created: deck.date_created,
            description: deck.description,
            rating: deck.rating,
            cards: deck.cards,
          },
        };
        result.push(formattedDeck);
      });
      return result;
    }, []);

    // Sort decks by highest rating
    const sortedDecks = formattedDecks.sort((a, b) => b.deck.rating - a.deck.rating);

    return sortedDecks;
  } catch (error) {
    throw error;
  }
};

userSchema.statics.getOneDecksofOneUser = async function (email, deck_name) {
  try {
    
  }
  catch (error) {
    throw error;
  }
}
userSchema.statics.getUsers = async function () {
  const res = await this.find({}, { email: 1 }).exec();
 console.log("res", res);
 const usersArray = res ? res.map(user => user.email) : [];
 console.log("usersArray", usersArray);
  return usersArray;
}



userSchema.statics.deleteUser = async function (email) {
  return this.deleteOne({ email })
}

const User = mongoose.model('user', userSchema);
module.exports = User;