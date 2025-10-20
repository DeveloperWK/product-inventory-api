interface courierData {
  invoice: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  cod_amount: number;
  note: string;
  delivery_type: number;
}
interface courierResponse {
  status: string;
  message: string;
  consignment: {
    consignment_id: number;
    tracking_code: string;
  };
}
const handleCourier = async (data: courierData) => {
  try {
    const res = await fetch(`${process.env.COURIER_URI}create_order`, {
      method: "POST",
      headers: {
        "Api-Key": process.env.COURIER_API_KEY as string,
        "Secret-Key": process.env.COURIER_SECRET_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        delivery_type: Number(data.delivery_type),
      }),
    });
    const result = await res.json();

    return {
      status: result.status,
      message: result.message,
      consignment: {
        consignment_id: result.consignment.consignment_id,
        tracking_code: result.consignment.tracking_code,
      },
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export default handleCourier;
