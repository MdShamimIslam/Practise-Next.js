import { bookingModel } from "@/models/booking-model";
import { hotelModel } from "@/models/hotel-model";
import { ratingModel } from "@/models/rating-model";
import { reviewModel } from "@/models/review-model";
import { userModel } from "@/models/user-model";
import {
  isDateInBetween,
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/utils/data-util";

// get all hotels
export const getAllHotels = async (destination, checkin, checkout,category) => {
  const regex = new RegExp(destination, "i");

  const hotelsByDestination = await hotelModel
    .find({ city: { $regex: regex } })
    .select([
      "thumbNailUrl",
      "name",
      "highRate",
      "lowRate",
      "city",
      "propertyCategory",
    ])
    .lean();

  let allHotels = hotelsByDestination;

  if (checkin && checkout) {
    allHotels = await Promise.all(
      allHotels.map(async (hotel) => {

        const found = await findBooking(hotel._id,checkin,checkout)

        if (found) {
          hotel["isBooked"] = true;
        } else {
          hotel["isBooked"] = false;
        }
   
        return hotel;
      })
    );
  }

  if (category) {
    const categoriesToMatch = category.split('|');
    allHotels = allHotels.filter((hotel) => {
      return categoriesToMatch.includes(hotel.propertyCategory.toString())
    })
  }

  return replaceMongoIdInArray(allHotels);
};


export const findBooking = async(hotel_id,checkin,checkout)=>{
  
  const matches = await bookingModel
          .find({ hotelId: hotel_id.toString() })
          .lean();

        const found = matches.find((match) => {
          return (
            isDateInBetween(checkin, match.checkin, match.checkout) ||
            isDateInBetween(checkout, match.checkin, match.checkout)
          );
        });

        return found;
}

// get hotel by id
  export const getHotelById = async (hotel_id,checkin,checkout) => {
  const hotel = await hotelModel.findById(hotel_id).lean();

    if (checkin && checkout) {
      const found = await findBooking(hotel._id,checkin,checkout);

      if (found) {
        hotel["isBooked"] = true;
      } else {
        hotel["isBooked"] = false;
      }
      
    }

  return replaceMongoIdInObject(hotel);
  
};

// get ratings by hotel id
export const getRatingsForHotel = async (hotel_id) => {
  const ratings = await ratingModel.find({ hotelId: hotel_id }).lean();
  return replaceMongoIdInArray(ratings);
};

// get reviews by hotel id
export const getReviewsForHotel = async (hotel_id) => {
  const reviews = await reviewModel.find({ hotelId: hotel_id }).lean();
  return replaceMongoIdInArray(reviews);
};

// get user by email
export const getUserByEmail = async(email)=>{
  const users = await userModel.find({email:email}).lean();
  return replaceMongoIdInObject(users[0]);
}

// get booking by user id
export const getBookingByUserId = async(userId)=>{
  const bookings = await bookingModel.find({userId: userId}).lean();
  return replaceMongoIdInArray(bookings);
}