export interface GoogleReviewText {
  text: string;
  languageCode: string;
}

export interface GoogleAuthorAttribution {
  displayName: string;
  uri: string;
  photoUri: string;
}

export interface GoogleReview {
  name: string;
  relativePublishTimeDescription: string;
  rating: number;
  text: GoogleReviewText;
  originalText?: GoogleReviewText;
  authorAttribution: GoogleAuthorAttribution;
  publishTime?: string;
}

export interface GooglePlaceDisplayName {
  text: string;
  languageCode: string;
}

export interface GooglePlacesResponse {
  id: string;
  displayName: GooglePlaceDisplayName;
  rating: number;
  userRatingCount: number;
  reviews: GoogleReview[];
  googleMapsUri?: string;
}

