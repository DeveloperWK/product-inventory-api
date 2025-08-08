interface courierData {
  invoice: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  cod_amount: number;
  note: string;
}
interface courierResponse {
  status: string;
  message: string;
  consignment: {
    consignment_id: number;
    tracking_code: string;
  };
}
const handleCourier = async (data: courierData): Promise<courierResponse> => {
  console.log(JSON.stringify(data));

  try {
    // const res = await fetch(`https://portal.packzy.com/api/v1/create_order`, {
    //   method: "POST",
    //   headers: {
    //     "Api-Key": process.env.COURIER_API_KEY as string,
    //     "Secret-Key": process.env.COURIER_SECRET_KEY as string,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(data),
    // });
    // const result = await res.json();
    return {
      status: "success",
      message: "Consignment created successfully",
      consignment: {
        consignment_id: 123456,
        tracking_code: "ABC123",
      },
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export default handleCourier;
