import { Card, CardContent } from "@/components/ui/card";
import { Users, DollarSign, ShoppingBag, UserCheck } from "lucide-react";

export const About = () => {
  const stats = [
    {
      icon: Users,
      value: "10.5k",
      label: "Sellers active our site",
      variant: "default"
    },
    {
      icon: DollarSign,
      value: "33k",
      label: "Monthly Product Sale",
      variant: "destructive"
    },
    {
      icon: ShoppingBag,
      value: "45.5k",
      label: "Customer active in our site",
      variant: "default"
    },
    {
      icon: UserCheck,
      value: "25k",
      label: "Annual gross sale in our site",
      variant: "default"
    }
  ];

  const team = [
    {
      name: "Tom Cruise",
      role: "Founder & Chairman",
      image: "/placeholder.svg"
    },
    {
      name: "Emma Watson",
      role: "Managing Director",
      image: "/placeholder.svg"
    },
    {
      name: "Will Smith",
      role: "Product Designer",
      image: "/placeholder.svg"
    }
  ];

  const services = [
    {
      icon: "🚚",
      title: "FREE AND FAST DELIVERY",
      description: "Free delivery for all orders over $140"
    },
    {
      icon: "🎧",
      title: "24/7 CUSTOMER SERVICE",
      description: "Friendly 24/7 customer support"
    },
    {
      icon: "💰",
      title: "MONEY BACK GUARANTEE",
      description: "We return money within 30 days"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <span>Home</span>
        <span>/</span>
        <span>About</span>
      </div>

      {/* Hero Section */}
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h1 className="text-4xl font-bold mb-6">Our Story</h1>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Launched in 2015, Exclusive is South Asia's premier online shopping marketplace with an active presence in Bangladesh. Supported by wide range of tailored marketing, data and service solutions, Exclusive has 10,500 sellers and 300 brands and serves 3 millions customers across the region.
            </p>
            <p>
              Exclusive has more than 1 Million products to offer, growing at a very fast. Exclusive offers a diverse assortment in categories ranging from consumer.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-pink-300 to-pink-500 flex items-center justify-center">
            <div className="text-white text-6xl">👥🛍️</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={stat.variant === "destructive" ? "bg-destructive text-destructive-foreground" : ""}>
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className={`p-3 rounded-full ${stat.variant === "destructive" ? "bg-white/20" : "bg-muted"}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Team */}
      <div className="mb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-[3/4] bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center text-6xl">
                  👤
                </div>
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-muted-foreground mb-4">{member.role}</p>
                <div className="flex justify-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-xs">🐦</span>
                  </div>
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-xs">📷</span>
                  </div>
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-xs">💼</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="grid md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <Card key={index}>
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="font-bold mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};