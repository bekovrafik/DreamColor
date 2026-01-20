class SavedBook {
  final String id;
  final String title;
  final String date;
  final String imageUrl; // Cover image
  final List<String> pages; // All pages
  final String theme;

  SavedBook({
    required this.id,
    required this.title,
    required this.date,
    required this.imageUrl,
    required this.pages,
    required this.theme,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'date': date,
      'imageUrl': imageUrl,
      'pages': pages,
      'theme': theme,
    };
  }

  factory SavedBook.fromJson(Map<String, dynamic> json) {
    return SavedBook(
      id: json['id'],
      title: json['title'],
      date: json['date'],
      imageUrl: json['imageUrl'],
      pages: List<String>.from(json['pages'] ?? []),
      theme: json['theme'],
    );
  }
}
