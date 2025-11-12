import { Card, CardContent } from "./ui/card";
import { useTranslation } from "react-i18next";
import { BadgeCheck, Shield, Truck, FileCheck2 } from "lucide-react";

export function ValuesSection() {
  const { t } = useTranslation();

  const values = [
    {
      icon: BadgeCheck,
      title: t("home.valueSavingsTitle"),
      desc: t("home.valueSavingsDesc"),
      color: "from-gray-500 to-gray-600",
      bgColor: "from-gray-100 to-gray-200"
    },
    {
      icon: Shield,
      title: t("home.valueGenuineTitle"),
      desc: t("home.valueGenuineDesc"),
      color: "from-emerald-500 to-emerald-600",
      bgColor: "from-emerald-100 to-emerald-200"
    },
    {
      icon: Truck,
      title: t("home.valueFastTitle"),
      desc: t("home.valueFastDesc"),
      color: "from-amber-500 to-amber-600",
      bgColor: "from-amber-100 to-amber-200"
    },
    {
      icon: FileCheck2,
      title: t("home.valueAllInTitle"),
      desc: t("home.valueAllInDesc"),
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-100 to-purple-200"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50/60 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] bg-gradient-to-br from-slate-100/30 to-gray-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            {t("home.valuesTitle")}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t("home.valuesDesc")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <Card
              key={value.title}
              className="text-center p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-white/85 backdrop-blur-sm hover:bg-white"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <CardContent className="p-0">
                <div className={`inline-flex p-4 bg-gradient-to-br ${value.bgColor} rounded-2xl mb-6`}>
                  <value.icon className={`h-8 w-8 bg-gradient-to-br ${value.color} bg-clip-text text-transparent`} />
                </div>
                <h3 className="font-bold text-xl mb-4">
                  {value.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {value.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

