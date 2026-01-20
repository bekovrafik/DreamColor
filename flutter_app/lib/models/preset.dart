class Preset {
  final String id;
  final String title;
  final String description;
  final String theme;
  final String thumbnailUrl;
  final bool isFeatured;

  Preset({
    required this.id,
    required this.title,
    required this.description,
    required this.theme,
    required this.thumbnailUrl,
    this.isFeatured = false,
  });

  factory Preset.fromMap(String id, Map<String, dynamic> map) {
    return Preset(
      id: id,
      title: map['title']?.toString() ?? '',
      description: map['description']?.toString() ?? '',
      theme: map['theme']?.toString() ?? '',
      thumbnailUrl: map['thumbnailURL']?.toString() ?? '',
      isFeatured: map['isFeatured'] is bool
          ? map['isFeatured']
          : false, // Safe fallback
    );
  }
}
