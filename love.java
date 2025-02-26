public class love {
    public static void main(String[] args) {
        int num1 = 10;
        int num2 = 20;// Strategy Interface
        interface PaymentStrategy {
            void pay(int amount);
        }
        
        // Concrete Strategy 1: Credit Card Payment
        class CreditCardPayment implements PaymentStrategy {
            private String name;
            private String cardNumber;
            private String cvv;
            private String expiryDate;
        
            public CreditCardPayment(String name, String cardNumber, String cvv, String expiryDate) {
                this.name = name;
                this.cardNumber = cardNumber;
                this.cvv = cvv;
                this.expiryDate = expiryDate;
            }
        
            @Override
            public void pay(int amount) {
                System.out.println("Paying " + amount + " using Credit Card: " + cardNumber);
                // Simulate credit card payment processing
                // In a real application, this would involve interacting with a payment gateway
                System.out.println("Payment Successful for credit card");
            }
        }
        
        // Concrete Strategy 2: PayPal Payment
        class PayPalPayment implements PaymentStrategy {
            private String emailId;
            private String password;
        
            public PayPalPayment(String emailId, String password) {
                this.emailId = emailId;
                this.password = password;
            }
        
            @Override
            public void pay(int amount) {
                System.out.println("Paying " + amount + " using PayPal: " + emailId);
                // Simulate PayPal payment processing
                // In a real application, this would involve interacting with a PayPal API
                System.out.println("Payment Successful for PayPal");
            }
        }
        
        // Context Class: Shopping Cart
        class ShoppingCart {
            private PaymentStrategy paymentStrategy;
        
            public void setPaymentStrategy(PaymentStrategy paymentStrategy) {
                this.paymentStrategy = paymentStrategy;
            }
        
            public void checkout(int amount) {
                if (paymentStrategy == null) {
                    System.out.println("Payment method not selected.");
                    return;
                }
                paymentStrategy.pay(amount);
            }
        }
        
        // Main Application
        public class StrategyPatternExample {
            public static void main(String[] args) {
                // Create a shopping cart
                ShoppingCart cart = new ShoppingCart();
        
                // Choose a payment strategy (Credit Card)
                PaymentStrategy creditCard = new CreditCardPayment("John Doe", "1234-5678-9012-3456", "123", "12/25");
                cart.setPaymentStrategy(creditCard);
                cart.checkout(100);
                System.out.println("--------------------------------");
        
                // Choose a different payment strategy (PayPal)
                PaymentStrategy payPal = new PayPalPayment("john.doe@example.com", "password123");
                cart.setPaymentStrategy(payPal);
                cart.checkout(50);
                System.out.println("--------------------------------");
        
                //Try checking out without a strategy set
                ShoppingCart cart2 = new ShoppingCart();
                cart2.checkout(120);
                System.out.println("--------------------------------");
            }
        }
        
        int sum = num1 + num2;
        System.out.println("The sum of " + num1 + " and " + num2 + " is: " + sum);
    }
}
