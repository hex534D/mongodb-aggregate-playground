// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('aggree');

// db.getCollection('users').findOne({})
// db.getCollection('books').findOne({})
// db.getCollection('authors').findOne({})

// 1. How many users are active
db.getCollection('users').aggregate([
  {
    $match: {
      isActive: true
    }
  },
  {
    $count: 'activeUsers'
  }
]);

// 2. What is the average age of each users?
db.getCollection('users').aggregate([
  {
    $group: {
      _id: '$gender',
      averageAge: {
        $avg: '$age',
      },
    },
  },
]);

// 3. list top 5 fav fruits among users
db.getCollection('users').aggregate([
  {
    $group: {
      _id: '$favoriteFruit',
      count: {
        $sum: 1
      }
    }
  },
  {
    $limit: 2
  },
  {
    $sort: {
      count: -1
    }
  }
]);

// 4. Find the total number of males and females
db.getCollection('users').aggregate([
  {
    $group: {
      _id: '$gender',
      count: {
        $sum: 1,
      },
    },
  },
]);

// 5. Which country has the highest number of users
db.getCollection('users').aggregate([
  {
    $group: {
      _id: '$company.location.country',
      usersCount: {
        $sum: 1,
      },
    },
  },
  {
    $sort: {
      usersCount: -1,
    },
  },
  {
    $limit: 1,
  },
]);

// 6. List all unique eye colors present in a collection
db.getCollection('users').aggregate([
  {
    $group: {
      _id: '$eyeColor'
    }
  }
]);

// 7. Average number of tags per user
db.getCollection('users').aggregate([
  {
    $unwind: {
      path: '$tags',
      preserveNullAndEmptyArrays: false,
    },
  },
  {
    $group: {
      _id: '$_id',
      numberOfTags: {
        $sum: 1
      }
    },
  },
  {
    $group: {
      _id: null,
      averageNumberOfTags: {
        $avg: '$numberOfTags'
      }
    }
  }
]);

db.getCollection('users').aggregate([
  {
    $addFields: {
      numberOfTags: {
        $size: {
          $ifNull: ['$tags', []],
        },
      },
    },
  },
  {
    $group: {
      _id: null,
      averageNumberOfTags: {
        $avg: '$numberOfTags'
      }
    }
  }
]);

// 8. How many users have 'enim' as one of their tags
db.getCollection('users').aggregate([
  {
    $match: {
      tags: 'enim'
    }
  },
  {
    $count: 'usersWithEnimTagCount'
  }
])

// 9. What are the names and age of users who are inactive & have 'velit' as tag?
db.getCollection('users').aggregate([
  {
    $match: {
      tags: 'velit',
      isActive: false,
    },
  },
  {
    $project: {
      _id: 0,
      name: 1,
      age: 1
    }
  }
]);

// 10. How many users have a phone number starting with '+1 (940)'?
db.getCollection('users').aggregate([
  {
    $match: {
      'company.phone': { $regex: /^\+1 \(940\)/ }
    }
  },
  {
    $count: 'usersWithSpecialNumber'
  }
]);

// 11. Who has registered most recently?
db.getCollection('users').aggregate([
  {
    $sort: {
      registered: -1,
    },
  },
  {
    $limit: 4,
  },
  {
    $project: {
      name: 1,
      favoriteFruit: 1,
      registered: 1,
    },
  },
]);

// 12. Categorize users by their favorite fruit
db.getCollection('users').aggregate([
  {
    $group: {
      _id: '$favoriteFruit',
      users: {
        $push: '$name'
      }
    },
  },
]);

// 13. How many users have 'ad' as second tag in their list of tags?
db.getCollection('users').aggregate([
  {
    $match: {
      'tags.1': 'ad',
    },
  },
  {
    $count: 'usersWithAdTag',
  },
]);

// 14. Find users who have 'enim' and 'id' as tags
db.getCollection('users').aggregate([
  {
    $match: {
      tags: { $all: ['enim', 'id'] },
    },
  },
]);

// 15. List all companies located in USA with their corresponding user count
db.getCollection('users').aggregate([
  {
    $match: {
      'company.location.country': 'USA',
    },
  },
  {
    $group: {
      _id: '$company',
      userCount: { $sum: 1 }
    },
  },
]);

// 16. lookup books and authors
db.getCollection('books').aggregate([
  {
    $lookup: {
      from: 'authors',
      localField: 'author_id',
      foreignField: '_id',
      as: 'author_details'
    }
  },
  {
    $addFields: {
      author_details: {
        $arrayElemAt: ['$author_details', 0]
      }
    }
  }
])
